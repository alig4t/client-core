import { BOT_VIEWNAMES } from "./../Models/Bot/Bot.viewnames";
import { CHANNEL_VIEWNAMES } from "./../Models/Channel/Channel.viewnames";
import { CITY_VIEWNAMES } from "./../Models/City/City.viewnames";
import { COMPREHENSIVE_ENTITY_VIEWNAMES } from "./../Models/ComprehensiveEntity/ComprehensiveEntity.viewnames";
import { DASHBOARD_DATA_VIEWNAMES } from "./../Models/DashboardData/DashboardData.viewnames";
import { KEYWORD_VIEWNAMES } from "./../Models/Keyword/Keyword.viewnames";
import { KEYWORD_MATCH_VIEWNAMES } from "./../Models/KeywordMatch/KeywordMatch.viewnames";
import { MESSAGE_VIEWNAMES } from "./../Models/Message/Message.viewnames";
import { MESSAGING_PLATFORM_VIEWNAMES } from "./../Models/MessagingPlatform/MessagingPlatform.viewnames";
import { PERSON_VIEWNAMES } from "./../Models/Person/Person.viewnames";
import { ROLE_VIEWNAMES } from "./../Models/Role/Role.viewnames";
import { USER_VIEWNAMES } from "./../Models/User/User.viewnames";
import { USER_CHANNEL_VIEWNAMES } from "./../Models/UserChannel/UserChannel.viewnames";
export const GENERATED_VIEWNAMES = {
  ...BOT_VIEWNAMES,
  ...CHANNEL_VIEWNAMES,
  ...CITY_VIEWNAMES,
  ...COMPREHENSIVE_ENTITY_VIEWNAMES,
  ...DASHBOARD_DATA_VIEWNAMES,
  ...KEYWORD_VIEWNAMES,
  ...KEYWORD_MATCH_VIEWNAMES,
  ...MESSAGE_VIEWNAMES,
  ...MESSAGING_PLATFORM_VIEWNAMES,
  ...PERSON_VIEWNAMES,
  ...ROLE_VIEWNAMES,
  ...USER_VIEWNAMES,
  ...USER_CHANNEL_VIEWNAMES,
} as const;
