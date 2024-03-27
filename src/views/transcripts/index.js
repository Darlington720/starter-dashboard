import React, { useEffect, useCallback, useMemo } from 'react'
import ActionBar from './components/ActionBar'
// import { AdaptableCard } from 'components/shared'
// import CustomersTable from './components/CustomersTable'
// import CustomersTableTools from './components/CustomersTableTools'
import NewProjectDialog from './components/NewProjectDialog'
import { Container } from 'components/shared'
import reducer from './store'
import { injectReducer } from 'store/index'

import { Avatar, Badge } from 'components/ui'
import { DataTable } from 'components/shared'
import { useDispatch, useSelector } from 'react-redux'
import { getCustomers, setTableData } from './customer-store/dataSlice'
import { setSelectedCustomer, setDrawerOpen } from './customer-store/stateSlice'
import useThemeClass from 'utils/hooks/useThemeClass'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'

injectReducer('projectList', reducer)

const statusColor = {
    active: 'bg-emerald-500',
    blocked: 'bg-red-500',
}

const ActionColumn = ({ row }) => {
    const { textTheme } = useThemeClass()
    const dispatch = useDispatch()

    const onEdit = () => {
        dispatch(setDrawerOpen())
        dispatch(setSelectedCustomer(row))
    }

    return (
        <div
            className={`${textTheme} cursor-pointer select-none font-semibold`}
            onClick={onEdit}
        >
            Edit
        </div>
    )
}

const NameColumn = ({ row }) => {
    const { textTheme } = useThemeClass()

    return (
        <div className="flex items-center">
            <Avatar size={28} shape="circle" src={row.img} />
            <Link
                className={`hover:${textTheme} ml-2 rtl:mr-2 font-semibold`}
                to={`/app/crm/customer-details?id=${row.id}`}
            >
                {row.name}
            </Link>
        </div>
    )
}

const columns = [
    {
        header: 'Student  Name',
        accessorKey: 'name',
        cell: (props) => {
            const row = props.row.original
            return <NameColumn row={row} />
        },
    },
    {
        header: 'Std Number',
        accessorKey: 'stdno',
    },
    {
        header: 'Award',
        accessorKey: 'award',
    },
    {
        header: 'Status',
        accessorKey: 'status',
        cell: (props) => {
            const row = props.row.original
            return (
                <div className="flex items-center">
                    <Badge
                        className={
                            statusColor[row.status] == 'verified'
                                ? 'active'
                                : 'blocked'
                        }
                    />
                    <span className="ml-2 rtl:mr-2 capitalize">
                        {row.status}
                    </span>
                </div>
            )
        },
    },
    {
        header: 'Uploaded on',
        accessorKey: 'lastOnline',
        cell: (props) => {
            const row = props.row.original
            return <div className="flex items-center">{row.uploaded_on}</div>
        },
    },
    {
        header: '',
        id: 'action',
        cell: (props) => <ActionColumn row={props.row.original} />,
    },
]

const ProjectList = () => {
    const dispatch = useDispatch()
    const data = [
        {
            id: 1,
            name: 'MULINDE HAKIM',
            stdno: '2300039393',
            award: 'MSTC',
            status: 'verified',
            uploaded_on: '2023-03-04',
        },
        {
            id: 2,
            name: 'MUTYABA IBRAHIM',
            stdno: '2200039844',
            award: 'MSIST',
            status: 'not_verified',
            uploaded_on: '2023-03-04',
        },
        {
            id: 3,
            name: 'KYOMUGISHA JOAN',
            stdno: '2300039493',
            award: 'MSCHT',
            status: 'verified',
            uploaded_on: '2023-03-04',
        },
        {
            id: 4,
            name: 'JOHNDOE',
            stdno: '2002020983',
            award: 'MISRET',
            status: 'not_verified',
            uploaded_on: '2023-03-04',
        },
    ]
    const loading = false
    const filterData = []

    const { pageIndex, pageSize, sort, query, total } = useSelector(
        (state) => []
    )

    const fetchData = useCallback(() => {
        dispatch(getCustomers({ pageIndex, pageSize, sort, query, filterData }))
    }, [pageIndex, pageSize, sort, query, filterData, dispatch])

    useEffect(() => {
        fetchData()
    }, [fetchData, pageIndex, pageSize, sort, filterData])

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total }),
        [pageIndex, pageSize, sort, query, total]
    )

    const onPaginationChange = (page) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        dispatch(setTableData(newTableData))
    }

    const onSelectChange = (value) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        dispatch(setTableData(newTableData))
    }

    const onSort = (sort) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        dispatch(setTableData(newTableData))
    }
    return (
        <Container className="h-full">
            <ActionBar />
            {/* <ProjectListContent /> */}

            {/* <AdaptableCard className="h-full" bodyClass="h-full">
                <CustomersTableTools />
                <CustomersTable />
            </AdaptableCard> */}

            <DataTable
                columns={columns}
                data={data}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={loading}
                pagingData={{ pageIndex, pageSize, sort, query, total }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
            />
            <NewProjectDialog />
        </Container>
    )
}

export default ProjectList
