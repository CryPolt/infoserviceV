import dynamic from 'next/dynamic';

// Dynamically import EditPage with SSR disabled
const EditPage = dynamic(() => import('@/app/pages/edit/page'), { ssr: false });

export default function CreatePage() {
    return (
        <div>
            <EditPage />
        </div>
    );
}
