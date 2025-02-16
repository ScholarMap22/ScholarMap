

export default function UsagePolicy() 
{
    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">{t("policy.title")}</h1>
            <p className="mb-4">{t("policy.intro")}</p>
            <h2 className="text-xl font-semibold mb-2">{t("policy.data.title")}</h2>
            <p className="mb-4">{t("policy.data.text")}</p>
            <h2 className="text-xl font-semibold mb-2">{t("policy.security.title")}</h2>
            <p className="mb-4">{t("policy.security.text")}</p>
            <h2 className="text-xl font-semibold mb-2">{t("policy.usage.title")}</h2>
            <p className="mb-4">{t("policy.usage.text")}</p>
        </div>
    );
}
