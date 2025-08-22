import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('InvitationsResolver (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create an invitation via GraphQL mutation', async () => {
    const mutation = {
      query: `
        mutation {
          createInvitation(input: {
            recipient: "Famiglia Ranieri Frontino"
          }) {
            _id
            recipient
          }
        }
      `,
    };

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send(mutation)
      .expect(200);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.data.createInvitation).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.data.createInvitation.recipient).toBe(
      'Famiglia Ranieri Frontino',
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.data.createInvitation._id).toBeDefined();
  });
});
