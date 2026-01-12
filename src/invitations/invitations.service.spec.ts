import { Test, TestingModule } from '@nestjs/testing';
import { InvitationsService } from './invitations.service';
import { getModelToken } from '@nestjs/mongoose';
import { Invitation } from './entities/invitation.entity';
import {
  CreateInvitationInput,
  UpdateInvitationInput,
  UpdateInvitationParticipantsInput,
} from './dto/invitation.input';
import { Age } from './entities/participant.entity';
import { ParticipantInput } from './dto/participant.input';

describe('InvitationsService', () => {
  let service: InvitationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitationsService,
        { provide: getModelToken(Invitation.name), useValue: jest.fn() },
      ],
    }).compile();

    service = module.get<InvitationsService>(InvitationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an invitation', async () => {
    const mockInvitationInput: CreateInvitationInput = {
      recipient: 'Test Invitation',
    };
    const mockSavedInvitation = {
      _id: '123',
      ...mockInvitationInput,
      save: jest.fn().mockResolvedValue({ _id: '123', ...mockInvitationInput }),
    };

    const invitationModel = {
      prototype: {},
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };
    // Mock the constructor to return our mockSavedInvitation
    const invitationModelMock = jest.fn(() => mockSavedInvitation);
    Object.assign(invitationModelMock, invitationModel);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitationsService,
        {
          provide: getModelToken(Invitation.name),
          useValue: invitationModelMock,
        },
      ],
    }).compile();

    const service = module.get<InvitationsService>(InvitationsService);

    const result = await service.create(mockInvitationInput);
    expect(result).toEqual({ _id: '123', ...mockInvitationInput });
    expect(mockSavedInvitation.save).toHaveBeenCalled();
  });

  it('should update an invitation', async () => {
    const mockId = '123';
    const mockUpdateInput: UpdateInvitationInput = {
      recipient: 'Updated Invitation',
    };
    const mockUpdatedInvitation = { _id: mockId, ...mockUpdateInput };

    const findByIdAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUpdatedInvitation),
    });

    const invitationModelMock = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (invitationModelMock as any).findByIdAndUpdate = findByIdAndUpdate;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitationsService,
        {
          provide: getModelToken(Invitation.name),
          useValue: invitationModelMock,
        },
      ],
    }).compile();

    const service = module.get<InvitationsService>(InvitationsService);

    const result = await service.update(mockId, mockUpdateInput);
    expect(result).toEqual(mockUpdatedInvitation);
    expect(findByIdAndUpdate).toHaveBeenCalledWith(
      mockId,
      { $set: mockUpdateInput },
      { new: true },
    );
  });

  it('should throw NotFoundException when updating non-existent invitation', async () => {
    const mockId = 'notfound';
    const mockUpdateInput: UpdateInvitationInput = {
      recipient: 'Updated Invitation',
    };
    const findByIdAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const invitationModelMock = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (invitationModelMock as any).findByIdAndUpdate = findByIdAndUpdate;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitationsService,
        {
          provide: getModelToken(Invitation.name),
          useValue: invitationModelMock,
        },
      ],
    }).compile();

    const service = module.get<InvitationsService>(InvitationsService);

    await expect(service.update(mockId, mockUpdateInput)).rejects.toThrow(
      `Invitation with ID "${mockId}" not found.`,
    );
  });

  it('should update invitation participants and contactPersonId correctly', async () => {
    const mockInvitationId: string = 'inv123';
    const participantId: string = '507f1f77bcf86cd799439011';
    const contactPersonId: string = participantId;
    const mockParticipants: ParticipantInput[] = [
      {
        _id: participantId,
        name: 'Alice',
        lastName: 'Smith',
        age: Age.ADULT,
        intolerances: '',
        celiac: false,
        vegetarian: false,
        vegan: false,
      },
      {
        name: 'Bob',
        lastName: 'Brown',
        age: Age.ADULT,
        intolerances: '',
        celiac: false,
        vegetarian: false,
        vegan: false,
      },
    ];
    const input: UpdateInvitationParticipantsInput = {
      contactPersonId,
      participants: mockParticipants,
    };

    const updatedInvitation: Invitation = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      _id: mockInvitationId as any,
      secret: 'secret',
      recipient: 'Test',
      confirmationStatus: 'pending',
      email: '',
      phoneNumber: '',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      contactPersonId: contactPersonId as any,
      isInterestedInAccommodation: false,
      participants: [
        {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          _id: participantId as any,
          name: 'Alice',
          lastName: 'Smith',
          age: Age.ADULT,
          intolerances: '',
          celiac: false,
          vegetarian: false,
          vegan: false,
        },
        {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          _id: expect.any(Object),
          name: 'Bob',
          lastName: 'Brown',
          age: Age.ADULT,
          intolerances: '',
          celiac: false,
          vegetarian: false,
          vegan: false,
        },
      ],
    };

    const findByIdAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(updatedInvitation),
    });

    const invitationModelMock = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (invitationModelMock as any).findByIdAndUpdate = findByIdAndUpdate;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitationsService,
        {
          provide: getModelToken(Invitation.name),
          useValue: invitationModelMock,
        },
      ],
    }).compile();

    const service = module.get<InvitationsService>(InvitationsService);

    const result = await service.updateInvitationParticipants(
      mockInvitationId,
      input,
    );
    expect(result).toEqual(updatedInvitation);
    expect(findByIdAndUpdate).toHaveBeenCalledWith(
      mockInvitationId,
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        participants: expect.any(Array),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        contactPersonId: expect.any(Object),
      }),
      { new: true, runValidators: true },
    );
  });

  it('should throw BadRequestException if contactPersonId does not match any participant', async () => {
    const mockInvitationId: string = 'inv123';
    const input: UpdateInvitationParticipantsInput = {
      contactPersonId: 'notfoundid',
      participants: [
        {
          _id: '507f1f77bcf86cd799439011',
          name: 'Alice',
          lastName: 'Smith',
          age: Age.ADULT,
          intolerances: '',
          celiac: false,
          vegetarian: false,
          vegan: false,
        },
      ],
    };

    const invitationModelMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitationsService,
        {
          provide: getModelToken(Invitation.name),
          useValue: invitationModelMock,
        },
      ],
    }).compile();

    const service = module.get<InvitationsService>(InvitationsService);

    await expect(
      service.updateInvitationParticipants(mockInvitationId, input),
    ).rejects.toThrow(
      'Contact person ID must belong to an existing participant in this invitation.',
    );
  });

  it('should throw BadRequestException if contactPersonId is set but participants is empty', async () => {
    const mockInvitationId: string = 'inv123';
    const input: UpdateInvitationParticipantsInput = {
      contactPersonId: '507f1f77bcf86cd799439011',
      participants: [],
    };

    const invitationModelMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitationsService,
        {
          provide: getModelToken(Invitation.name),
          useValue: invitationModelMock,
        },
      ],
    }).compile();

    const service = module.get<InvitationsService>(InvitationsService);

    await expect(
      service.updateInvitationParticipants(mockInvitationId, input),
    ).rejects.toThrow(
      'Contact person ID must be null when there are no participants.',
    );
  });

  it('should throw NotFoundException if invitation not found when updating participants', async () => {
    const mockInvitationId: string = 'notfound';
    const input: UpdateInvitationParticipantsInput = {
      participants: [],
    };

    const findByIdAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const invitationModelMock = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (invitationModelMock as any).findByIdAndUpdate = findByIdAndUpdate;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitationsService,
        {
          provide: getModelToken(Invitation.name),
          useValue: invitationModelMock,
        },
      ],
    }).compile();

    const service = module.get<InvitationsService>(InvitationsService);

    await expect(
      service.updateInvitationParticipants(mockInvitationId, input),
    ).rejects.toThrow(`Invitation with ID "${mockInvitationId}" not found.`);
  });

  it('should find all invitations', async () => {
    const mockInvitations = [
      {
        _id: '1',
        recipient: 'Alice',
        confirmationStatus: 'pending',
        email: 'alice@example.com',
        phoneNumber: '123456789',
        contactPersonId: null,
        isInterestedInAccommodation: false,
        participants: [],
      },
      {
        _id: '2',
        recipient: 'Bob',
        confirmationStatus: 'confirmed',
        email: 'bob@example.com',
        phoneNumber: '987654321',
        contactPersonId: null,
        isInterestedInAccommodation: true,
        participants: [],
      },
    ];

    const find = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockInvitations),
    });

    const invitationModelMock = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (invitationModelMock as any).find = find;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitationsService,
        {
          provide: getModelToken(Invitation.name),
          useValue: invitationModelMock,
        },
      ],
    }).compile();

    const service = module.get<InvitationsService>(InvitationsService);

    const result = await service.findAll();
    expect(result).toEqual(mockInvitations);
    expect(find).toHaveBeenCalled();
  });

  it('should find one invitation by id', async () => {
    const mockId = '507f1f77bcf86cd799439011';
    const mockInvitation = {
      _id: mockId,
      recipient: 'Charlie',
      confirmationStatus: 'pending',
      email: 'charlie@example.com',
      phoneNumber: '555555555',
      contactPersonId: null,
      isInterestedInAccommodation: false,
      participants: [],
    };

    const findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockInvitation),
    });

    const invitationModelMock = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (invitationModelMock as any).findById = findById;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitationsService,
        {
          provide: getModelToken(Invitation.name),
          useValue: invitationModelMock,
        },
      ],
    }).compile();

    const service = module.get<InvitationsService>(InvitationsService);

    const result = await service.findOne(mockId);
    expect(result).toEqual(mockInvitation);
    expect(findById).toHaveBeenCalledWith(mockId);
  });

  it('should throw NotFoundException when finding non-existent invitation', async () => {
    const mockId = 'notfoundid';

    const findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const invitationModelMock = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (invitationModelMock as any).findById = findById;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitationsService,
        {
          provide: getModelToken(Invitation.name),
          useValue: invitationModelMock,
        },
      ],
    }).compile();

    const service = module.get<InvitationsService>(InvitationsService);

    await expect(service.findOne(mockId)).rejects.toThrow(
      `Invitation with ID "${mockId}" not found.`,
    );
  });
});
