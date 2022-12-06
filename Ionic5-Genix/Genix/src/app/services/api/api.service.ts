import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormioAppConfig } from 'angular-formio';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    /**
     * Constructor of the Service with Dependency Injection
     * @param http The standard Angular HttpClient to make requests
     */
    constructor(private http: HttpClient, public config: FormioAppConfig) {}

    /**
     * Get lists all forms within Formio project by type
     *
     * @param {string} type to retrieve information
     * @returns Observable with all forms information
     */
    getListFormsByType(type: string) {
        return this.http.get(`${this.config.appUrl}/form?type=${type}`);
    }

    /**
     * Get lists all forms
     *
     * @returns Observable with all forms information
     */
    getAllForm() {
        return this.http.get(`${this.config.appUrl}/form`);
    }

    /**
     * Get lists all submissions
     *
     * @param {string} form
     * @returns Observable with all submissions information
     */
    getListSubmissions(form: string) {
        return this.http.get(`${this.config.appUrl}/${form}/submission`);
    }
}
