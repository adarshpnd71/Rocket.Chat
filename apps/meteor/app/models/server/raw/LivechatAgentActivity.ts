import moment from 'moment';
import type { AggregationCursor, Cursor, FindAndModifyWriteOpResultObject, IndexSpecification, UpdateWriteOpResult } from 'mongodb';

import { ILivechatAgentActivity, IServiceHistory } from '../../../../definition/ILivechatAgentActivity';
import { BaseRaw } from './BaseRaw';

export class LivechatAgentActivityRaw extends BaseRaw<ILivechatAgentActivity> {
	modelIndexes(): IndexSpecification[] {
		return [{ key: { date: 1 } }, { key: { agentId: 1, date: 1 }, unique: true }];
	}

	findOneByAgendIdAndDate(agentId: string, date: ILivechatAgentActivity['date']): Promise<ILivechatAgentActivity | null> {
		return this.findOne({ agentId, date });
	}

	async createOrUpdate(
		data: Partial<Pick<ILivechatAgentActivity, 'date' | 'agentId' | 'lastStartedAt'>> = {},
	): Promise<FindAndModifyWriteOpResultObject<ILivechatAgentActivity> | undefined> {
		const { date, agentId, lastStartedAt } = data;

		if (!date || !agentId) {
			return;
		}

		return this.findOneAndUpdate(
			{ agentId, date },
			{
				$unset: {
					lastStoppedAt: 1,
				},
				$set: {
					lastStartedAt: lastStartedAt || new Date(),
				},
				$setOnInsert: {
					date,
					agentId,
				},
			},
		);
	}

	updateLastStoppedAt({
		agentId,
		date,
		lastStoppedAt,
		availableTime,
	}: Pick<ILivechatAgentActivity, 'date' | 'agentId' | 'lastStoppedAt' | 'availableTime'>): Promise<UpdateWriteOpResult> {
		const query = {
			agentId,
			date,
		};
		const update = {
			$inc: { availableTime },
			$set: {
				lastStoppedAt,
			},
		};
		return this.updateMany(query, update);
	}

	updateServiceHistory({
		agentId,
		date,
		serviceHistory,
	}: Pick<ILivechatAgentActivity, 'date' | 'agentId'> & { serviceHistory: IServiceHistory }): Promise<UpdateWriteOpResult> {
		const query = {
			agentId,
			date,
		};
		const update = {
			$addToSet: {
				serviceHistory,
			},
		};
		return this.updateMany(query, update);
	}

	findOpenSessions(): Cursor<ILivechatAgentActivity> {
		const query = {
			lastStoppedAt: { $exists: false },
		};

		return this.find(query);
	}

	findAllAverageAvailableServiceTime({ date, departmentId }: { date: Date; departmentId: string }): Promise<ILivechatAgentActivity[]> {
		const match = { $match: { date } };
		const lookup = {
			$lookup: {
				from: 'rocketchat_livechat_department_agents',
				localField: 'agentId',
				foreignField: 'agentId',
				as: 'departments',
			},
		};
		const unwind = {
			$unwind: {
				path: '$departments',
				preserveNullAndEmptyArrays: true,
			},
		};
		const departmentsMatch = {
			$match: {
				'departments.departmentId': departmentId,
			},
		};
		const sumAvailableTimeWithCurrentTime = {
			$sum: [{ $divide: [{ $subtract: [new Date(), '$lastStartedAt'] }, 1000] }, '$availableTime'],
		};
		const group = {
			$group: {
				_id: null,
				allAvailableTimeInSeconds: {
					$sum: {
						$cond: [{ $ifNull: ['$lastStoppedAt', false] }, '$availableTime', sumAvailableTimeWithCurrentTime],
					},
				},
				rooms: { $sum: 1 },
			},
		};
		const project = {
			$project: {
				averageAvailableServiceTimeInSeconds: {
					$trunc: {
						$cond: [{ $eq: ['$rooms', 0] }, 0, { $divide: ['$allAvailableTimeInSeconds', '$rooms'] }],
					},
				},
			},
		};
		const params = [match] as object[];
		if (departmentId && departmentId !== 'undefined') {
			params.push(lookup);
			params.push(unwind);
			params.push(departmentsMatch);
		}
		params.push(group);
		params.push(project);
		return this.col.aggregate(params).toArray();
	}

	findAvailableServiceTimeHistory({
		start,
		end,
		fullReport,
		onlyCount = false,
		options = {},
	}: {
		start: string;
		end: string;
		fullReport: boolean;
		onlyCount: boolean;
		options: any;
	}): AggregationCursor<ILivechatAgentActivity> {
		const match = {
			$match: {
				date: {
					$gte: parseInt(moment(start).format('YYYYMMDD')),
					$lte: parseInt(moment(end).format('YYYYMMDD')),
				},
			},
		};
		const lookup = {
			$lookup: {
				from: 'users',
				localField: 'agentId',
				foreignField: '_id',
				as: 'user',
			},
		};
		const unwind = {
			$unwind: {
				path: '$user',
			},
		};
		const group = {
			$group: {
				_id: { _id: '$user._id', username: '$user.username' },
				serviceHistory: { $first: '$serviceHistory' },
				availableTimeInSeconds: { $sum: '$availableTime' },
			},
		};
		const project = {
			$project: {
				_id: 0,
				username: '$_id.username',
				availableTimeInSeconds: 1,
				...(fullReport && { serviceHistory: 1 }),
			},
		};

		const sort = { $sort: options.sort || { username: 1 } };
		const params = [match, lookup, unwind, group, project, sort] as object[];
		if (onlyCount) {
			params.push({ $count: 'total' });
			return this.col.aggregate(params);
		}
		if (options.offset) {
			params.push({ $skip: options.offset });
		}
		if (options.count) {
			params.push({ $limit: options.count });
		}
		return this.col.aggregate(params, { allowDiskUse: true });
	}
}
