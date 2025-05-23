import React from "react"

enum StatusTranslation {
    APPROVED = "Tasdiqlangan",
    PENDING = "Kutilmoqda",
    REJECTED = "Rad etilgan",
    REVISION = "Tahrir talab etiladi",
    ARCHIVED = "Arxivlangan",
    DELETED = "O‘chirilgan",
    DEFAULT = "Noma'lum holat",
}

const ResourceChanges = ({
         resource,
changes,
                         }: {
    resource: any
    changes: any
}) => {
    if (!resource || !changes) {
        return <p>O'zgartirishlar ma'lumotlari yuklanmagan</p>
    }
    console.log(resource)
    console.log(changes)
    const getChangedField = (
        fieldName: string,
        oldValue: any,
        newValue: any,
        isStatus = false
    ) => {
        const isChanged = newValue !== undefined && oldValue !== newValue
        if (isStatus) {
            const translateStatus = (status: string | undefined): string => {
                if (!status) {
                    return StatusTranslation.DEFAULT
                }
                return (
                    StatusTranslation[status.toUpperCase() as keyof typeof StatusTranslation] ||
                    StatusTranslation.DEFAULT
                )
            }

            const oldTranslated = translateStatus(oldValue)
            const newTranslated = translateStatus(newValue)

            return (
                <div className="mb-2">
                    <p className="text-sm font-medium">
                        <strong>{fieldName}:</strong>
                    </p>
                    {isChanged && (
                        <p className="text-sm text-red-500">- {oldTranslated}</p>
                    )}
                    {isChanged ? (
                        <p className="text-sm text-green-500 font-semibold">
                            + {newTranslated}
                        </p>
                    ) : (
                        <p className="text-sm">{oldTranslated}</p>
                    )}
                </div>
            )
        }
        return (
            <div className="mb-2">
                <p className="text-sm font-medium">
                    <strong>{fieldName}:</strong>
                </p>
                {isChanged && (
                    <p className="text-sm text-red-500">- {oldValue}</p>
                )}
                {isChanged ? (
                    <p className="text-sm text-green-500 font-semibold">
                        + {newValue}
                    </p>
                ) : (
                    <p className="text-sm">{oldValue}</p>
                )}
            </div>
        )
    }

    return (
        <div className="text-sm bg-gray-50 border border-gray-200 rounded p-4">
            {getChangedField("Sarlavha", resource.title, changes.title)}
            {getChangedField("Tavsif", resource.description, changes.description)}
            {getChangedField("Holat (Status)", resource.status, changes.status, true)} {/* `true` for status translation */}
            {getChangedField("Til (Language)", resource.language, changes.language)}
            {getChangedField("DOI", resource.doi, changes.doi)}
        </div>
    )
}

export default ResourceChanges