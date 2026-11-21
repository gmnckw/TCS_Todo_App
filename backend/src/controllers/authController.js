import { sendSuccess } from '../utils/respond.js';

const HTTP_OK = 200;

export function createAuthController(authService) {
  return {
    async login(req, res) {
      const { email, password } = req.validated.body;
      const result = await authService.login(email, password);
      sendSuccess(res, HTTP_OK, result);
    },
  };
}
