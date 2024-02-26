import { getPathsFromParams } from '$lib/fs/path'
import { createReadableStream } from '@sveltejs/kit/node'
import type { RequestHandler } from './$types'
import { error } from '@sveltejs/kit'
import { open } from 'node:fs/promises'

export const GET: RequestHandler = async ({ params }) => {
    const { fsPath } = getPathsFromParams(params)

    try {

        const response = new Response(createReadableStream(fsPath))
        console.log(response.headers.get("Content-Length"))

        return response
        
  //       const file = await open(fsPath, 'r')
		// const response = new Response(await file.readFile())
		// response.headers.set("Content-Length", (await file.stat()).size.toString())
		//
		// file.close()
		// return response

    } catch (err) {
        console.warn(err)
        throw error(404, `Could not find ${fsPath}`)
    }
}
