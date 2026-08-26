import type { BoardLink, BoardSolutionLink, EvidenceBoardState } from '../types/game'

export function emptyEvidenceBoard(): EvidenceBoardState {
  return { pins: [], links: [] }
}

export function linkKey(a: string, b: string): string {
  return a < b ? `${a}::${b}` : `${b}::${a}`
}

export function isSolutionLink(
  fromClueId: string,
  toClueId: string,
  solutions: BoardSolutionLink[] | undefined,
): boolean {
  if (!solutions?.length) return false
  const key = linkKey(fromClueId, toClueId)
  return solutions.some((s) => linkKey(s.a, s.b) === key)
}

export function countMatchedSolutionLinks(
  links: BoardLink[],
  solutions: BoardSolutionLink[] | undefined,
): number {
  if (!solutions?.length) return 0
  const found = new Set(
    links
      .filter((l) => isSolutionLink(l.fromClueId, l.toClueId, solutions))
      .map((l) => linkKey(l.fromClueId, l.toClueId)),
  )
  return found.size
}

export function stripClueFromBoard(board: EvidenceBoardState, clueId: string): EvidenceBoardState {
  return {
    pins: board.pins.filter((p) => p.clueId !== clueId),
    links: board.links.filter((l) => l.fromClueId !== clueId && l.toClueId !== clueId),
  }
}
