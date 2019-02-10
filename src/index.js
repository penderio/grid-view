import React from 'react'
import {css} from 'emotion'
import PropTypes from 'prop-types'
import {Table, AutoSizer, Column} from 'react-virtualized'
import 'react-virtualized/styles.css'

const defaultCellDataGetter = ({id, data}) => {
        return data.cells[id]
}

export default class GridView extends React.Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired,
        rowGetter: PropTypes.func.isRequired,
        cellDataGetter: PropTypes.func.isRequired,
        fieldRenderer: PropTypes.func.isRequired,
        fields: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired
            })
        )
    }

    render() {

        const cellDataGetter = this.props.cellDataGetter || defaultCellDataGetter

        return (
            <AutoSizer>
                {({width, height}) => (
                    <Table
                        headerHeight={40}
                        height={height}
                        overscanRowCount={10}
                        rowGetter={this.props.rowGetter}
                        rowHeight={40}
                        rowCount={this.props.rowCount}
                        width={width}
                        headerClassName={css`
                            font-weight: 400;
                            text-transform: none;
                        `}
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
                    height: 24px;
                    overflow: hidden;
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