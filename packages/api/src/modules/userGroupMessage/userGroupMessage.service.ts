import { Service, Inject } from "typedi"
import { UserGroupMessageRepository } from "./userGroupMessage.repository"
import { UserGroupMessage } from "./userGroupMessage.entity"
import { MessageRepository } from "../message/message.repository"

@Service()
export class UserGroupMessageService {
  @Inject(() => UserGroupMessageRepository)
  userGroupMessageRepository: UserGroupMessageRepository
  @Inject(() => MessageRepository)
  messageRepository: MessageRepository

  async create(data: Partial<UserGroupMessage>): Promise<UserGroupMessage> {
    const group = await UserGroupMessage.create(data).save()
    return group
  }

  async createFirst(
    userId: string,
    groupId: string,
    courseId: string,
  ): Promise<UserGroupMessage> {
    const firstMessage = await this.messageRepository.findByOrderCourse(
      1,
      courseId,
    )
    return await UserGroupMessage.create({
      userId,
      messageId: firstMessage.id,
    }).save()
  }

  async update(
    userGroupMessageId: string,
    data: Partial<UserGroupMessage>,
    updateToNextMessage: boolean,
  ): Promise<UserGroupMessage> {
    const userMessage = await this.userGroupMessageRepository.findById(
      userGroupMessageId,
    )
    let messageId
    updateToNextMessage &&
      (await this.messageRepository // Update to next message
        .findNext(userMessage.messageId)
        .then(res => (messageId = res.id)))

    const newData = {
      ...data,
      messageId: updateToNextMessage ? messageId : userMessage.messageId,
    }

    return userMessage.update(newData)
  }

  async destroy(userGroupMessageId: string): Promise<boolean> {
    const group = await this.userGroupMessageRepository.findById(
      userGroupMessageId,
    )
    return group.destroy()
  }

  async destroyByUserId(userId: string): Promise<boolean> {
    const group = await this.userGroupMessageRepository.findByUserId(userId)
    return group.destroy()
  }

  async resetAllUserGroupMessages() {
    const userMessages = await this.userGroupMessageRepository.findAll()

    userMessages.map(userMessage => {
      userMessage.update({ isRead: false })
    })
  }
}
