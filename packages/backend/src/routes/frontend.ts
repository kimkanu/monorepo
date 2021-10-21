import fs from 'fs';
import path from 'path';

import express, { Router } from 'express';

const router = Router();

const buildPath = path.join(__dirname, '..', '..', '..', 'frontend', 'build');
const pathToPassThrough = /^\/(sock|static\/)/;
const publicFiles = fs.readdirSync(buildPath, { withFileTypes: true })
  .filter((dirent) => dirent.isFile())
  .map((dirent) => `/${dirent.name}`)
  .filter((file) => file !== '/index.html');

router.use('/*', (req, res, next) => {
  if (pathToPassThrough.test(req.baseUrl) || publicFiles.includes(req.baseUrl)) {
    next();
    return;
  }
  res.sendFile(
    path.join(buildPath, 'index.html'),
  );
});

// /static*
router.use(
  '/static',
  express.static(
    path.join(buildPath, 'static'),
  ),
);

// public files
router.use(
  publicFiles,
  (req, res) => {
    res.sendFile(
      path.join(
        buildPath, req.baseUrl.slice(1),
      ),
    );
  },
);

export default router;
