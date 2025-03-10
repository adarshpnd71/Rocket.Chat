import type { DeleteWriteOpResultObject } from 'mongodb';

import { IRoom } from '../../../definition/IRoom';
import { ISetting } from '../../../definition/ISetting';
import { IUser } from '../../../definition/IUser';
import { AddWebdavAccountMethod } from './methods/addWebdavAccount';
import { FollowMessageMethod } from './methods/followMessage';
import { GetReadReceiptsMethod } from './methods/getReadReceipts';
import { UnsubscribeMethod as MailerUnsubscribeMethod } from './methods/mailer/unsubscribe';
import { RoomNameExistsMethod } from './methods/roomNameExists';
import { SaveRoomSettingsMethod } from './methods/saveRoomSettings';
import { SaveSettingsMethod } from './methods/saveSettings';
import { SaveUserPreferencesMethod } from './methods/saveUserPreferences';
import { UnfollowMessageMethod } from './methods/unfollowMessage';

// TODO: frontend chapter day - define methods

export type ServerMethods = {
	'2fa:checkCodesRemaining': (...args: any[]) => any;
	'2fa:disable': (...args: any[]) => any;
	'2fa:enable': (...args: any[]) => any;
	'2fa:regenerateCodes': (...args: any[]) => any;
	'2fa:validateTempToken': (...args: any[]) => any;
	'addOAuthApp': (...args: any[]) => any;
	'addOAuthService': (...args: any[]) => any;
	'addUsersToRoom': (...args: any[]) => any;
	'addWebdavAccount': AddWebdavAccountMethod;
	'apps/go-enable': (...args: any[]) => any;
	'apps/is-enabled': (...args: any[]) => any;
	'authorization:addPermissionToRole': (...args: any[]) => any;
	'authorization:addUserToRole': (...args: any[]) => any;
	'authorization:deleteRole': (...args: any[]) => any;
	'authorization:removeRoleFromPermission': (...args: any[]) => any;
	'authorization:removeUserFromRole': (...args: any[]) => any;
	'authorization:saveRole': (...args: any[]) => any;
	'bbbEnd': (...args: any[]) => any;
	'bbbJoin': (...args: any[]) => any;
	'blockUser': (...args: any[]) => any;
	'checkUsernameAvailability': (...args: any[]) => any;
	'cleanRoomHistory': (...args: any[]) => any;
	'clearIntegrationHistory': (...args: any[]) => any;
	'cloud:checkRegisterStatus': () => {
		connectToCloud: string;
		workspaceRegistered: string;
		workspaceId: string;
		uniqueId: string;
		token: string;
		email: string;
	};
	'cloud:checkUserLoggedIn': (...args: any[]) => any;
	'cloud:connectWorkspace': (...args: any[]) => any;
	'cloud:disconnectWorkspace': (...args: any[]) => any;
	'cloud:finishOAuthAuthorization': (...args: any[]) => any;
	'cloud:getOAuthAuthorizationUrl': (...args: any[]) => any;
	'cloud:getWorkspaceRegisterData': (...args: any[]) => any;
	'cloud:logout': (...args: any[]) => any;
	'cloud:registerWorkspace': (...args: any[]) => any;
	'cloud:syncWorkspace': (...args: any[]) => any;
	'deleteCustomSound': (...args: any[]) => any;
	'deleteCustomUserStatus': (...args: any[]) => any;
	'deleteFileMessage': (...args: any[]) => any;
	'deleteOAuthApp': (...args: any[]) => any;
	'deleteUserOwnAccount': (...args: any[]) => any;
	'e2e.resetOwnE2EKey': (...args: any[]) => any;
	'eraseRoom': (...args: any[]) => any;
	'followMessage': FollowMessageMethod;
	'getAvatarSuggestion': (...args: any[]) => any;
	'getSetupWizardParameters': () => {
		settings: ISetting[];
		serverAlreadyRegistered: boolean;
		hasAdmin: boolean;
	};
	'getUsersOfRoom': (...args: any[]) => any;
	'hideRoom': (...args: any[]) => any;
	'ignoreUser': (...args: any[]) => any;
	'insertOrUpdateSound': (...args: any[]) => any;
	'insertOrUpdateUserStatus': (...args: any[]) => any;
	'instances/get': (...args: any[]) => any;
	'jitsi:generateAccessToken': (...args: any[]) => any;
	'jitsi:updateTimeout': (...args: any[]) => any;
	'leaveRoom': (...args: any[]) => any;
	'license:getModules': () => string[];
	'license:getTags': (...args: any[]) => any;
	'livechat:addMonitor': (...args: any[]) => any;
	'livechat:changeLivechatStatus': (...args: any[]) => any;
	'livechat:closeRoom': (...args: any[]) => any;
	'livechat:discardTranscript': (...args: any[]) => any;

	// TODO: chapter day backend - enhance/deprecate
	'livechat:facebook':
		| ((...args: [{ action: 'initialState' }]) => {
				enabled: boolean;
				hasToken: boolean;
		  })
		| ((...args: [{ action: 'list-pages' }]) => {
				name: string;
				subscribed: boolean;
				id: string;
		  }[])
		| ((...args: [{ action: 'subscribe' | 'unsubscribe'; page: string }]) => {})
		| ((...args: [{ action: 'enable' }]) => { url: string } | undefined)
		| ((...args: [{ action: 'disable' }]) => {});
	'livechat:getAgentOverviewData': (...args: any[]) => any;
	'livechat:getAnalyticsChartData': (...args: any[]) => any;
	'livechat:getAnalyticsOverviewData': (...args: any[]) => any;
	'livechat:getRoutingConfig': (...args: any[]) => any;
	'livechat:removeAllClosedRooms': (...args: any[]) => any;
	'livechat:removeBusinessHour': (...args: any[]) => any;
	'livechat:removeCustomField': (...args: any[]) => any;
	'livechat:removeMonitor': (...args: any[]) => any;
	'livechat:removePriority': (...args: any[]) => any;
	'livechat:removeRoom': (...args: any[]) => any;
	'livechat:removeTag': (...args: any[]) => any;
	'livechat:removeTrigger': (...args: any[]) => any;
	'livechat:removeUnit': (...args: any[]) => any;
	'livechat:requestTranscript': (...args: any[]) => any;
	'livechat:returnAsInquiry': (...args: any[]) => any;
	'livechat:sendTranscript': (...args: any[]) => any;
	'livechat:transfer': (...args: any[]) => any;
	'livechat:saveAgentInfo': (...args: any[]) => any;
	'livechat:saveAppearance': (...args: any[]) => any;
	'livechat:saveBusinessHour': (...args: any[]) => any;
	'livechat:saveCustomField': (...args: any[]) => any;
	'livechat:saveDepartment': (...args: any[]) => any;
	'livechat:saveIntegration': (...args: any[]) => any;
	'livechat:savePriority': (...args: any[]) => any;
	'livechat:saveTag': (...args: any[]) => any;
	'livechat:saveTrigger': (...args: any[]) => any;
	'livechat:saveUnit': (...args: any[]) => any;
	'livechat:webhookTest': (...args: any[]) => any;
	'Mailer.sendMail': (from: string, subject: string, body: string, dryrun: boolean, query: string) => any;
	'muteUserInRoom': (...args: any[]) => any;
	'personalAccessTokens:generateToken': (...args: any[]) => any;
	'personalAccessTokens:regenerateToken': (...args: any[]) => any;
	'personalAccessTokens:removeToken': (...args: any[]) => any;
	'readMessages': (...args: any[]) => any;
	'refreshClients': (...args: any[]) => any;
	'refreshOAuthService': (...args: any[]) => any;
	'registerUser': (...args: any[]) => any;
	'removeOAuthService': (...args: any[]) => any;
	'removeWebdavAccount': (accountId: string) => DeleteWriteOpResultObject;
	'removeCannedResponse': (...args: any[]) => any;
	'replayOutgoingIntegration': (...args: any[]) => any;
	'requestDataDownload': (...args: any[]) => any;
	'resetPassword': (...args: any[]) => any;
	'roomNameExists': RoomNameExistsMethod;
	'saveCannedResponse': (...args: any[]) => any;
	'saveRoomSettings': SaveRoomSettingsMethod;
	'saveSettings': SaveSettingsMethod;
	'saveUserPreferences': SaveUserPreferencesMethod;
	'saveUserProfile': (...args: any[]) => any;
	'sendConfirmationEmail': (...args: any[]) => any;
	'sendInvitationEmail': (...args: any[]) => any;
	'setAdminStatus': (...args: any[]) => any;
	'setAsset': (...args: any[]) => any;
	'setAvatarFromService': (...args: any[]) => any;
	'setUsername': (...args: any[]) => any;
	'setUserPassword': (...args: any[]) => any;
	'setUserStatus': (statusType: IUser['status'], statusText: IUser['statusText']) => void;
	'toggleFavorite': (...args: any[]) => any;
	'unblockUser': (...args: any[]) => any;
	'unfollowMessage': UnfollowMessageMethod;
	'unmuteUserInRoom': (...args: any[]) => any;
	'unreadMessages': (...args: any[]) => any;
	'unsetAsset': (...args: any[]) => any;
	'updateIncomingIntegration': (...args: any[]) => any;
	'updateOAuthApp': (...args: any[]) => any;
	'updateOutgoingIntegration': (...args: any[]) => any;
	'uploadCustomSound': (...args: any[]) => any;
	'Mailer:unsubscribe': MailerUnsubscribeMethod;
	'getRoomById': (rid: IRoom['_id']) => IRoom;
	'getReadReceipts': GetReadReceiptsMethod;
	'checkRegistrationSecretURL': (hash: string) => boolean;
};

export type ServerMethodName = keyof ServerMethods;

export type ServerMethodParameters<MethodName extends ServerMethodName> = Parameters<ServerMethods[MethodName]>;

export type ServerMethodReturn<MethodName extends ServerMethodName> = ReturnType<ServerMethods[MethodName]>;

export type ServerMethodFunction<MethodName extends ServerMethodName> = (
	...args: ServerMethodParameters<MethodName>
) => Promise<ServerMethodReturn<MethodName>>;
