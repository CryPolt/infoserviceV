// src/app/admin/page.js
'use client'
import AdminPageManager from './(components)/AdminSettingsManager/AdminSettingsManager';
import HomePageEditor from "@/app/admin/(components)/HomePageEditor/HomePageEditor";
import {
    SchemeContentEditor
} from "@/app/admin/(components)/SchemeContentEditor/SchemeContentEditor";

export default function AdminPage() {
    return (
        <>
        <div>
            <AdminPageManager />
           <br/>
            <HomePageEditor />
            <br />
            <SchemeContentEditor  />
        </div>
        </>
    );
}
