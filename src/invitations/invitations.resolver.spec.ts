import { Test, TestingModule } from '@nestjs/testing';
import { InvitationsResolver } from './invitations.resolver';
import { Invitation } from './entities/invitation.entity';
import { getModelToken } from '@nestjs/mongoose';
import { InvitationsService } from './invitations.service';
import { JwtService } from '@nestjs/jwt';

describe('InvitationsResolver', () => {
  let resolver: InvitationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitationsResolver,
        InvitationsService,
        JwtService,
        { provide: getModelToken(Invitation.name), useValue: jest.fn() },
      ],
    }).compile();

    resolver = module.get<InvitationsResolver>(InvitationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
