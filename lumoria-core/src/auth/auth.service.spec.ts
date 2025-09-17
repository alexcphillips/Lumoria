import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue("test-token"),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("validateUser", () => {
    it("should return null for invalid credentials", async () => {
      const result = await service.validateUser("test@example.com", "password");
      expect(result).toBeNull();
    });
  });

  describe("login", () => {
    it("should throw UnauthorizedException for invalid credentials", async () => {
      await expect(
        service.login({ email: "test@example.com", password: "password" }),
      ).rejects.toThrow("Invalid credentials");
    });
  });
});
