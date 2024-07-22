// src/app/admin/page.js
import AdminPageManager from './(components)/AdminSettingsManager/AdminSettingsManager';
import HomePageEditor from "@/app/admin/(components)/HomePageEditor/HomePageEditor";

export default function AdminPage() {
    return (
        <>
        <div>
            <AdminPageManager />
           <br/>
            <HomePageEditor />
        </div>
        </>
    );
}
