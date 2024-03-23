import { outro, confirm } from '@clack/prompts'
import { exit } from 'node:process'
import { populateFileDataCache } from '../src/lib/fs/file.server'
import { logger } from '../src/lib/logger'


const path = '/media/odilf/UOH-ARCHIVE/Hierarchy/Pictures'
const pathComponents = path.split('/').slice(3)

logger.debug("test")

exit()

const confirmed = await confirm({
    message: `About to populate ${pathComponents.join("/")}. This might take a while. Are you sure you want to proceed?`,
})

if (!confirmed) {
    outro('Bailing')
    exit()
}

logger.info("Starting")


await populateFileDataCache(pathComponents)

logger.info("finished")

outro('Cache has been populated!')
