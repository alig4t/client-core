import { BotRoutes } from "./../Models/Bot/Bot.routes";
import { ChannelRoutes } from "./../Models/Channel/Channel.routes";
import { CityRoutes } from "./../Models/City/City.routes";
import { ComprehensiveEntityRoutes } from "./../Models/ComprehensiveEntity/ComprehensiveEntity.routes";
import { DashboardDataRoutes } from "./../Models/DashboardData/DashboardData.routes";
import { KeywordRoutes } from "./../Models/Keyword/Keyword.routes";
import { KeywordMatchRoutes } from "./../Models/KeywordMatch/KeywordMatch.routes";
import { MessageRoutes } from "./../Models/Message/Message.routes";
import { MessagingPlatformRoutes } from "./../Models/MessagingPlatform/MessagingPlatform.routes";
import { PersonRoutes } from "./../Models/Person/Person.routes";
import { RoleRoutes } from "./../Models/Role/Role.routes";
import { UserRoutes } from "./../Models/User/User.routes";
import { UserChannelRoutes } from "./../Models/UserChannel/UserChannel.routes";
export const generatedRoutes = [
  ...BotRoutes,
  ...ChannelRoutes,
  ...CityRoutes,
  ...ComprehensiveEntityRoutes,
  ...DashboardDataRoutes,
  ...KeywordRoutes,
  ...KeywordMatchRoutes,
  ...MessageRoutes,
  ...MessagingPlatformRoutes,
  ...PersonRoutes,
  ...RoleRoutes,
  ...UserRoutes,
  ...UserChannelRoutes,
];
