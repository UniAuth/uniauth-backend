import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { MailerService } from '../mailer/mailer.service';
import { ApplicationService } from '../application/application.service';
import { closeInMongodConnection } from '../../test-utils/MongooseTestModule';

describe('AccountController', () => {
  let controller: AccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useFactory: () => ({
            validateAccessRequest: jest.fn(() => true),
            authenticateAndGenerateToken: jest.fn(() => true),
            provideUserDetailOnAccess: jest.fn(() => true),
          }),
        },
        {
          provide: ApplicationService,
          useFactory: () => ({
            pushUserIntoApplicationParticipantList: jest.fn(() => true),
          }),
        },
        {
          provide: AuthService,
          useFactory: () => ({
            generateJwt: jest.fn(() => true),
          }),
        },
        {
          provide: UserService,
          useFactory: () => ({
            request: jest.fn(() => true),
            reset: jest.fn(() => true),
            create: jest.fn(() => true),
            pushApplicationIntoUserParticipantList: jest.fn(() => true),
          }),
        },
        {
          provide: MailerService,
          useFactory: () => ({
            sendPasswordResetLink: jest.fn(() => true),
            checkPasswordResetToken: jest.fn(() => true),
            checkVerificationToken: jest.fn(() => true),
            sendEMail: jest.fn(() => true),
          }),
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('.showLoginPageAsAuth()', () => {
    it('should be defined', () => {
      expect(controller.showLoginPageAsAuth).toBeDefined();
    });
  });

  describe('.processLoginPageAsAuth()', () => {
    it('should be defined', () => {
      expect(controller.processLoginPageAsAuth).toBeDefined();
    });
  });

  describe('.shareUserDetailsViaAuth()', () => {
    it('should be defined', () => {
      expect(controller.shareUserDetailsViaAuth).toBeDefined();
    });
  });

  describe('.showLoginPage()', () => {
    it('should be defined', () => {
      expect(controller.showLoginPage).toBeDefined();
    });
  });

  describe('.logoutUser()', () => {
    it('should be defined', () => {
      expect(controller.logoutUser).toBeDefined();
    });
  });

  describe('.processLoginPage()', () => {
    it('should be defined', () => {
      expect(controller.processLoginPage).toBeDefined();
    });
  });

  describe('.showPasswordRequestPage()', () => {
    it('should be defined', () => {
      expect(controller.showPasswordRequestPage).toBeDefined();
    });
  });

  describe('.processRequestPage()', () => {
    it('should be defined', () => {
      expect(controller.processRequestPage).toBeDefined();
    });
  });

  describe('.showPasswordResetPage()', () => {
    it('should be defined', () => {
      expect(controller.showPasswordResetPage).toBeDefined();
    });
  });

  describe('.processResetPage()', () => {
    it('should be defined', () => {
      expect(controller.processResetPage).toBeDefined();
    });
  });

  describe('.showRegisterPage()', () => {
    it('should be defined', () => {
      expect(controller.showRegisterPage).toBeDefined();
    });
  });

  describe('.showRegisterSuccessPage()', () => {
    it('should be defined', () => {
      expect(controller.showRegisterSuccessPage).toBeDefined();
    });
  });

  describe('.processRegisterPage()', () => {
    it('should be defined', () => {
      expect(controller.processRegisterPage).toBeDefined();
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
