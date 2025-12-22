import { BaseService } from "@/core/service/BaseService";
import type { MessageModel } from "./MessageModel";

class MessageService extends BaseService<MessageModel> {
  constructor() {
    super("/message");
  }
}

export default new MessageService();
