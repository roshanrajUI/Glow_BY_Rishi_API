import { Body, Get, Post, Route, Tags } from "tsoa";
import { Service } from "typedi";

@Route("/api/auth")
@Service()
@Tags("Auth")

export default class AuthController {
  constructor() { }

  @Post("/register")
  public async createUser(@Body() userDetails: any) {
    return {}
  };

//   @Post("/login")
//   public async loginUser(@Body() loginUser: {email: string, password: string}): Promise<LoginUser> {
//     return await this.authService.loginUser(loginUser.email, loginUser.password);
//   };
}