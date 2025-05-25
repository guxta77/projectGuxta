import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);

  canActivate() {
    return authState(this.auth).pipe(
      map(user => {
        if (user) return true;
        this.router.navigate(['/auth/login']);
        return false;
      })
    );
  }
}
