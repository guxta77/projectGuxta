import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ThemeSwitchComponent } from '../../shared/theme-switch/theme-switch.component';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { doc, setDoc, Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ThemeSwitchComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  nickname = '';
  email = '';
  password = '';
  confirmPassword = '';
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(@Inject(Auth) private auth: Auth, private firestore: Firestore, private router: Router) {}

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  register() {
  this.submitted = true;

  if (this.password !== this.confirmPassword) {
    console.error('As senhas não coincidem.');
    return;
  }

  createUserWithEmailAndPassword(this.auth, this.email, this.password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      if (user) {
        // Atualiza o displayName no Auth
        await updateProfile(user, { displayName: this.nickname });

        await setDoc(doc(this.firestore, `usuarios/${user.uid}`), {
          displayName: this.nickname,
          filmesFavoritos: [],
          seriesFavoritas: [],
          listaParaAssistir: []
        });

        this.router.navigate(['/auth/login']);
      }
    })
    .catch((error) => {
      console.error('Erro no cadastro:', error);
    });
}


}
