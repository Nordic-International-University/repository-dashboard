import React from "react"

const ResourceDetails = ({ resource }: { resource: any }) => {
    if (!resource) return <p>Resurs ma'lumotlari yuklanmagan</p>

    return (
        <div className="text-sm h-full bg-gray-50 p-4 border-1 mt-9">
            <p><strong>Sarlavha:</strong> {resource.title}</p>
            <p><strong>Tavsif:</strong> {resource.description}</p>
            <p><strong>DOI:</strong> {resource.doi}</p>
            <p><strong>Til:</strong> {resource.language}</p>
            <p><strong>Kolleksiya:</strong> {resource.collection?.title}</p>
            <p><strong>Fanni nomi:</strong> {resource.subject?.name}</p>
            <p>
                <strong>Keywords:</strong>{" "}
                {resource.keywords.map((keyword: any) => keyword.keyword.value).join(", ")}
            </p>
            <p><strong>Avtorlar:</strong></p>
            <ul className="pl-4 list-disc">
                {resource.authors.map((author: any) => (
                    <li key={author.id}>
                        {author.fullname} - {author.degree}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ResourceDetails