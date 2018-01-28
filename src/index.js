import { join } from 'path';
import { walkDir } from 'xazure-builder-common';
import logger, { Levels } from 'xazure-logger';
import consoleLogger from 'xazure-logger-console';

export default async (dir, config, { source, dest, builders: builderConfigs },
                      watch = false, level = Levels.LOG) => {
  const builders = builderConfigs.map(({ builder, name, matcher }) =>
    ({ name, matcher, builder: builder(dir, config) }));

  logger.configure({ modules: [consoleLogger], level });

  walkDir(join(dir, source), filePath => {
    const { name, builder } = builders.find(({ matcher }) => matcher(filePath));

    if (!name) {
      logger.debug(`[skip] ${filePath}`);
    } else {
      logger.log(`${name ? `[${name}] ` : ''}${filePath}`);
      return Promise.resolve(builder(filePath)).then(() => logger.DEBUG(`[${name}] ${filePath} done.`));
    }
  });
};