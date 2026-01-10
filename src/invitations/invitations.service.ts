import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invitation, InvitationDocument } from './entities/invitation.entity';
import {
  CreateInvitationInput,
  UpdateInvitationInput,
  UpdateInvitationParticipantsInput,
} from './dto/invitation.input';
import { Participant } from './entities/participant.entity';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectModel(Invitation.name)
    private invitationModel: Model<InvitationDocument>,
  ) {}

  async create(input: CreateInvitationInput): Promise<Invitation> {
    const createdInvitation = new this.invitationModel(input);
    return createdInvitation.save();
  }

  async update(id: string, input: UpdateInvitationInput): Promise<Invitation> {
    const updatedInvitation = await this.invitationModel
      .findByIdAndUpdate(id, { $set: input }, { new: true })
      .exec();
    if (!updatedInvitation) {
      throw new NotFoundException(`Invitation with ID "${id}" not found.`);
    }
    return updatedInvitation;
  }

  async updateInvitationParticipants(
    invitationId: string,
    input: UpdateInvitationParticipantsInput,
  ): Promise<Invitation> {
    const { contactPersonId, participants } = input;

    const newParticipants: Participant[] = participants.map((p) => {
      // Se l'ID esiste, lo usiamo, altrimenti ne generiamo uno nuovo
      return {
        ...p,
        _id: p._id ? new Types.ObjectId(p._id) : new Types.ObjectId(),
      };
    }) as Participant[];

    // Se non ci sono partecipanti, il referente_id deve essere nullo
    if (newParticipants.length === 0) {
      if (contactPersonId) {
        throw new BadRequestException(
          'Contact person ID must be null when there are no participants.',
        );
      }
    }

    // Validiamo che il referente_id, se fornito, esista tra i nuovi partecipanti
    if (contactPersonId) {
      const contactPersonExists = newParticipants.some(
        (p) => p._id.toString() === contactPersonId,
      );
      if (!contactPersonExists) {
        throw new BadRequestException(
          'Contact person ID must belong to an existing participant in this invitation.',
        );
      }
    }

    // Aggiorna i partecipanti e il referente_id nell'invito
    const updatedInvitation = await this.invitationModel
      .findByIdAndUpdate(
        invitationId,
        {
          participants: newParticipants,
          contactPersonId:
            newParticipants.length > 0
              ? new Types.ObjectId(contactPersonId)
              : null,
        },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedInvitation) {
      throw new NotFoundException(
        `Invitation with ID "${invitationId}" not found.`,
      );
    }

    return updatedInvitation;
  }

  async findAll(): Promise<Invitation[]> {
    return this.invitationModel.find().exec();
  }

  async findOne(id: string): Promise<Invitation> {
    const invitation = await this.invitationModel.findById(id).exec();
    if (!invitation) {
      throw new NotFoundException(`Invitation with ID "${id}" not found.`);
    }
    return invitation;
  }
}
