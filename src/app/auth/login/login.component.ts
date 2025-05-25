import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ThemeSwitchComponent } from '../../shared/theme-switch/theme-switch.component';

import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ThemeSwitchComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  showPassword = false;

  private auth = inject(Auth);
  private router = inject(Router);

  async login() {
    this.errorMessage = '';
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      console.log('Login bem-sucedido!');
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Erro no login:', error);
      this.errorMessage = this.getFriendlyErrorMessage(error.code);
    }
  }

    toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  private getFriendlyErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
        return 'Usuário não encontrado.';
      case 'auth/wrong-password':
        return 'Senha incorreta.';
      case 'auth/invalid-email':
        return 'Email inválido.';
      default:
        return 'Erro ao fazer login. Tente novamente.';
    }
  }
}
