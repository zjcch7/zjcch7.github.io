import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'any' })
export class LoginService {
    private currentUserLoggedInSource = new BehaviorSubject<boolean>(false);
    private currentUserNameSource = new BehaviorSubject<string>("No user");

    currentUserLoggedIn$ = this.currentUserLoggedInSource.asObservable();
    currentUserName$ = this.currentUserNameSource.asObservable();

    constructor(private http: HttpClient) { }

    loginUser(username: string) {
        this.currentUserLoggedInSource.next(true);
        this.currentUserNameSource.next(username);
    }

    logoutUser(): Observable<any> {
        // Make an HTTP request to the server to invalidate the session/token
        return this.http.post('http://localhost:3000/api/logout', {}, { withCredentials: true });
    }

    // Call this method to handle client-side logout actions
    performLogout() {
        this.logoutUser().subscribe({
            next: () => {
                // Update the BehaviorSubjects to reflect the logout
                this.currentUserLoggedInSource.next(false);
                this.currentUserNameSource.next("No user");
                // Handle other client-side logout logic if needed
            },
            error: (error) => {
                // Handle any errors here
                console.error('Logout error', error);
            }
        });
    }

    
}
