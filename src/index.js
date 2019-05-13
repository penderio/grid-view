import React from 'react'
import {css} from 'emotion'
import PropTypes from 'prop-types'
import {Table, AutoSizer, Column} from 'react-virtualized'

const defaultCellDataGetter = ({id, data}) => {
        return data.cells[id]
}

export default class GridView extends React.Component {

    static propTypes = {
        rowCount: PropTypes.number.isRequired,
        rowGetter: PropTypes.func.isRequired,
        cellDataGetter: PropTypes.func.isRequired,
        fieldRenderer: PropTypes.func.isRequired,
        fields: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired
            })
        ),
        defaultHeight: PropTypes.number,
        defaultWidth: PropTypes.number
    }

    render() {

        const {defaultHeight, defaultWidth} = this.props

        return (
            <AutoSizer defaultHeight={defaultHeight} defaultWidth={defaultWidth}>
                {({width, height}) => (
                    <Table
                        headerHeight={50}
                        height={height}
                        overscanRowCount={10}
                        rowGetter={this.props.rowGetter}
                        rowHeight={60}
                        rowCount={this.props.rowCount}
                        width={width}
                    >
                        {this.props.fields.map(field => (
                            <Column
                                key={field.id}
                                width={200}
                                label={field.name}
                                dataKey={field.id}
                                cellDataGetter={this.cellDataGetter}
                                cellRenderer={this.cellRenderer}
                            />
                        ))}

                    </Table>
                )}
            </AutoSizer>
        )
    }

    cellDataGetter = ({dataKey, rowData}) => {
        const cellDataGetter = this.props.cellDataGetter || defaultCellDataGetter
        return cellDataGetter({
            id: dataKey,
            data: rowData
        })
    }

    cellRenderer = (params) => {

        const {columnIndex, rowData, cellData} = params

        const field = this.props.fields[columnIndex]

        return (
            <div
                className={css`
                    width: 100%;
                    max-width: 100%;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    line-height: 1.5;
                    -webkit-box-align: center;
                    align-items: center;
                    display: inline-flex;
                    cursor: pointer;
                    height: 100%;
                    overflow: hidden;
                    font-size: 13px;
                `}
            >
                {this.props.fieldRenderer({
                    id: rowData.id,
                    field,
                    cell: cellData,
                    index: columnIndex,
                    props: {
                        id: field.id,
                        contextId: 'recordListItem',
                        roleId: 'readOnly'
                    }
                })}
            </div>
        )
    }
}