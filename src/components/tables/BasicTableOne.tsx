'use client'

import React, { useState } from "react";
import { Table, Avatar, Tag, Space } from "antd";
import type { ColumnsType } from "antd/es/table";

interface Community {
    id: number;
    name: string;
    description: string;
    logo: string;
    collectionsCount: number;
    status: "Active" | "Pending" | "Archived";
    createdAt: string;
}

const allData: Community[] = [
    {
        id: 5,
        name: "Jurnalistika fakulteti",
        description: "Matbuot va axborot tahlillari",
        logo: "/images/logos/journal.png",
        collectionsCount: 4,
        status: "Active",
        createdAt: "2023-10-10",
    },
    {
        id: 6,
        name: "Xorijiy tillar fakulteti",
        description: "Til o‘rganish va tarjimonlik",
        logo: "/images/logos/lang.png",
        collectionsCount: 6,
        status: "Pending",
        createdAt: "2023-09-05",
    },
    {
        id: 7,
        name: "Qurilish va Arxitektura fakulteti",
        description: "Loyihalash va dizayn ishlari",
        logo: "/images/logos/arch.png",
        collectionsCount: 2,
        status: "Archived",
        createdAt: "2022-07-01",
    },
    {
        id: 8,
        name: "Yurisprudensiya fakulteti",
        description: "Huquqiy tadqiqotlar",
        logo: "/images/logos/law.png",
        collectionsCount: 5,
        status: "Active",
        createdAt: "2022-05-15",
    },
]

const columns: ColumnsType<Community> = [
    {
        title: "Jamiyat",
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
            <Space>
                <Avatar shape="square" src={record.logo} />
                <div>
                    <div className="font-medium">{record.name}</div>
                    <div className="text-xs text-gray-400">{record.description}</div>
                </div>
            </Space>
        ),
    },
    {
        title: "To‘plamlar",
        dataIndex: "collectionsCount",
        key: "collectionsCount",
        render: (count) => <span>{count} ta</span>,
    },
    {
        title: "Holat",
        dataIndex: "status",
        key: "status",
        render: (status: Community["status"]) => {
            let color = "green";
            if (status === "Pending") color = "gold";
            else if (status === "Archived") color = "red";
            return <Tag color={color}>{status}</Tag>;
        },
    },
    {
        title: "Yaratilgan sana",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date: string) =>
            new Date(date).toLocaleDateString("uz-UZ", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }),
    },
];

const AntdCommunitiesTable: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentData = allData.slice(startIndex, endIndex);

    return (
        <div>
            <Table
                className="px-0"
                columns={columns}
                dataSource={currentData}
                rowKey="id"
                bordered
                pagination={false}
            />


        </div>
    );
};

export default AntdCommunitiesTable;
