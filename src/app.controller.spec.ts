import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { Response } from 'express';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('редиректит на переданный url с кодом 302', () => {
    const mockRes = { redirect: jest.fn() } as unknown as Response;
    controller.redirect('https://example.com', mockRes);
    expect(mockRes.redirect).toHaveBeenCalledWith(302, 'https://example.com');
  });

  it('передаёт url как есть, без изменений', () => {
    const mockRes = { redirect: jest.fn() } as unknown as Response;
    const url = 'https://example.com/path?foo=bar&baz=qux';
    controller.redirect(url, mockRes);
    expect(mockRes.redirect).toHaveBeenCalledWith(302, url);
  });
});
