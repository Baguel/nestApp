import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (req.session.user) {
      req.user = req.session.user._id;
      next();
    } else {
      return res.redirect('/auth/login');
    }
  }
}
