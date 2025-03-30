import m from 'mithril';

export function loop(num: number): number[] {
    return Array.from({ length: num }, (_, i) => i)
}

export const getCellSize = (size: number) => ({ height: `${size}px`, width: `${size}px` });

export const getBlankTable = (width: number, height: number, cellSize: CellSize) =>
    m("table.blank", loop(height).map(_ =>
        m("tr.blank", loop(width).map(_ =>
            m("td.blank", { style: cellSize })
        ))
    ))