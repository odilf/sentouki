import type { RequestHandler } from './$types'

export const GET: RequestHandler = ({ url, params }) => {
    const path = params.path.split('/').filter(Boolean)
    const fsPath
}
