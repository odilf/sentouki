import { outro, confirm } from '@clack/prompts'
import { exit } from 'node:process'
import { populateFileDataCache } from '../src/lib/fs/file.server'

const confirmed = await confirm({
    message: 'This might take a while. Are you sure you want to proceed?',
})

if (!confirmed) {
    exit()
}

await populateFileDataCache()

outro('Cache has been populated!')
