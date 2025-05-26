import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TmdbService } from '../../services/tmdb.service';
import { firstValueFrom } from 'rxjs';
import { ThemeSwitchComponent } from '../../shared/theme-switch/theme-switch.component';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import html2canvas from 'html2canvas';

interface ItemLista {
  titulo: string;
  link: string;
  capa: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ThemeSwitchComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private auth = inject(Auth);
  private router = inject(Router);
  private firestore = inject(Firestore);
  termoFilme = '';
  modalAberto = false;
  menuAberto = false;
  tipoBusca: 'filme' | 'serie' | 'ambos' = 'ambos';
  resultadosFilmes: any[] = [];

  filmesFavoritos: ItemLista[] = [];
  seriesFavoritas: ItemLista[] = [];
  listaParaAssistir: ItemLista[] = [];
  redesSociais: { link: string, icone: SafeHtml }[] = [];

  constructor(private tmdb: TmdbService, private sanitizer: DomSanitizer) {

    this.redesSociais = [
      {
        link: 'https://www.instagram.com/gustavo_trindade77',
        icone: this.sanitizer.bypassSecurityTrustHtml(`
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 21C18.7614 21 21 18.7614 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21Z" stroke="#FA41FE" stroke-width="2" stroke-miterlimit="10"/>
            <path d="M21.5 4.5H10.5C7.18629 4.5 4.5 7.18629 4.5 10.5V21.5C4.5 24.8137 7.18629 27.5 10.5 27.5H21.5C24.8137 27.5 27.5 24.8137 27.5 21.5V10.5C27.5 7.18629 24.8137 4.5 21.5 4.5Z" stroke="#FA41FE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22.5 11C23.3284 11 24 10.3284 24 9.5C24 8.67157 23.3284 8 22.5 8C21.6716 8 21 8.67157 21 9.5C21 10.3284 21.6716 11 22.5 11Z" fill="#FA41FE"/>
          </svg>
        `)
      },
      {
        link: 'https://www.youtube.com/@GuxtaTrindade',
        icone: this.sanitizer.bypassSecurityTrustHtml(`
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 16L14 12V20L20 16Z" stroke="#F40000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 16C3 19.725 3.3875 21.9 3.675 23.025C3.75427 23.3302 3.90418 23.6126 4.11262 23.8493C4.32106 24.0859 4.58221 24.2703 4.875 24.3875C9.0625 25.9875 16 25.95 16 25.95C16 25.95 22.9375 25.9875 27.125 24.3875C27.4178 24.2703 27.6789 24.0859 27.8874 23.8493C28.0958 23.6126 28.2457 23.3302 28.325 23.025C28.6125 21.9 29 19.725 29 16C29 12.275 28.6125 10.1 28.325 8.975C28.2457 8.66975 28.0958 8.38741 27.8874 8.15074C27.6789 7.91407 27.4178 7.7297 27.125 7.6125C22.9375 6.0125 16 6.05 16 6.05C16 6.05 9.0625 6.0125 4.875 7.6125C4.58221 7.7297 4.32106 7.91407 4.11262 8.15074C3.90418 8.38741 3.75427 8.66975 3.675 8.975C3.3875 10.1 3 12.275 3 16Z" stroke="#F40000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `)
      },
      {
        link: 'https://www.github.com/guxta77',
        icone: this.sanitizer.bypassSecurityTrustHtml(`
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        `)
      }
    ];

  }

  async ngOnInit() {
  const user = this.auth.currentUser;
  if (!user) return;

  const userDoc = doc(this.firestore, `usuarios/${user.uid}`);
  const publicDoc = doc(this.firestore, `usuarios/${user.uid}/publico/dados`);

  const [privateSnap, publicSnap] = await Promise.all([
    getDoc(userDoc),
    getDoc(publicDoc)
  ]);

  if (privateSnap.exists()) {
    const data = privateSnap.data();
    this.filmesFavoritos = data['filmesFavoritos'] || [];
    this.seriesFavoritas = data['seriesFavoritas'] || [];
    this.listaParaAssistir = data['listaParaAssistir'] || [];

    if (!publicSnap.exists()) {
      const publicData = {
        displayName: user.displayName || '',
        filmesFavoritos: this.limparLista(this.filmesFavoritos),
        seriesFavoritas: this.limparLista(this.seriesFavoritas),
        listaParaAssistir: this.limparLista(this.listaParaAssistir)
      };
      await setDoc(publicDoc, publicData, { merge: true });
    }
  }
}


  abrirModal(tipo: 'filme' | 'serie' | 'ambos') {
    this.tipoBusca = tipo;
    this.modalAberto = true;
    this.termoFilme = '';
    this.resultadosFilmes = [];
  }

  fecharModal() {
    this.modalAberto = false;
    this.termoFilme = '';
    this.resultadosFilmes = [];
  }

  async buscarFilmesOuSeries() {
    if (!this.termoFilme.trim()) {
      this.resultadosFilmes = [];
      return;
    }

    if (this.tipoBusca === 'filme') {
      this.tmdb.searchMovies(this.termoFilme).subscribe(res => {
        this.resultadosFilmes = res.results;
      });
    } else if (this.tipoBusca === 'serie') {
      this.tmdb.searchSeries(this.termoFilme).subscribe(res => {
        this.resultadosFilmes = res.results;
      });
    } else {
      const [filmes, series] = await Promise.all([
        firstValueFrom(this.tmdb.searchMovies(this.termoFilme)),
        firstValueFrom(this.tmdb.searchSeries(this.termoFilme))
      ]);
      this.resultadosFilmes = [...filmes.results, ...series.results];
    }
  }

  adicionarItem(item: any) {
    const entrada: ItemLista = {
      titulo: item.title || item.name,
      link: `https://www.themoviedb.org/${item.title ? 'movie' : 'tv'}/${item.id}`,
      capa: `https://image.tmdb.org/t/p/w440_and_h660_face${item.poster_path || item.backdrop_path}`
    };

    function existeNaLista(lista: ItemLista[], titulo: string) {
      return lista.some(i => i.titulo === titulo);
    }

    if (this.tipoBusca === 'filme' && item.title) {
      if (!existeNaLista(this.filmesFavoritos, entrada.titulo)) {
        this.filmesFavoritos.push(entrada);
        this.removerResultado(item.id);
      }
    } else if (this.tipoBusca === 'serie' && item.name) {
      if (!existeNaLista(this.seriesFavoritas, entrada.titulo)) {
        this.seriesFavoritas.push(entrada);
        this.removerResultado(item.id);
      }
    } else {
      if (!existeNaLista(this.listaParaAssistir, entrada.titulo)) {
        this.listaParaAssistir.push(entrada);
        this.removerResultado(item.id);
      }
    }

    this.salvarListas();
  }

  removerItem(tipo: 'filme' | 'serie' | 'assistir', item: ItemLista) {
    if (tipo === 'filme') {
      this.filmesFavoritos = this.filmesFavoritos.filter(f => f.titulo !== item.titulo);
    } else if (tipo === 'serie') {
      this.seriesFavoritas = this.seriesFavoritas.filter(s => s.titulo !== item.titulo);
    } else {
      this.listaParaAssistir = this.listaParaAssistir.filter(i => i.titulo !== item.titulo);
    }

    this.salvarListas();
  }

  async salvarListas() {
  const user = this.auth.currentUser;
  if (!user) return;

  const dados = {
    displayName: user.displayName || '',
    filmesFavoritos: this.limparLista(this.filmesFavoritos),
    seriesFavoritas: this.limparLista(this.seriesFavoritas),
    listaParaAssistir: this.limparLista(this.listaParaAssistir)
  };

  await setDoc(doc(this.firestore, `usuarios/${user.uid}`), dados, { merge: true });

  await setDoc(doc(this.firestore, `usuarios/${user.uid}/publico/dados`), dados, { merge: true });
}



  private limparLista(lista: ItemLista[]): ItemLista[] {
    return lista.filter(item =>
      item &&
      typeof item.titulo === 'string' &&
      typeof item.link === 'string' &&
      typeof item.capa === 'string' &&
      item.titulo.trim() !== '' &&
      item.link.startsWith('https://') &&
      item.capa.startsWith('https://')
    );
  }

  removerResultado(id: number) {
    this.resultadosFilmes = this.resultadosFilmes.filter(item => item.id !== id);
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

   compartilharLink() {
    const uid = this.auth.currentUser?.uid;
    const link = `${window.location.origin}/pagina/${uid}`;

    if (navigator.share) {
      navigator.share({
        title: 'Veja minha lista de filmes e séries!',
        text: 'Dá uma olhada no que eu curto assistir 🎬📺',
        url: link
      });
    } else {
      navigator.clipboard.writeText(link);
      alert('Link copiado! Agora é só colar onde quiser.');
    }

    this.menuAberto = false;
  }

  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}
