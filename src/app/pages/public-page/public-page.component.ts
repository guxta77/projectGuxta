import { Firestore, docData, doc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ThemeSwitchComponent } from '../../shared/theme-switch/theme-switch.component';

interface DadosPublicos {
  displayName?: string;
  filmesFavoritos: any[];
  seriesFavoritas: any[];
  listaParaAssistir: any[];
}

@Component({
  selector: 'app-public-page',
  standalone: true,
  imports: [CommonModule, ThemeSwitchComponent],
  templateUrl: './public-page.component.html',
  styleUrls: ['./public-page.component.scss']
})
export class PublicPageComponent implements OnInit {
  uid = '';
  displayName: string = '';
  filmesFavoritos: any[] = [];
  seriesFavoritas: any[] = [];
  listaParaAssistir: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get('uid')!;
    this.carregarDadosPublicos();
  }

  carregarDadosPublicos() {
    const docRef = doc(this.firestore, `usuarios/${this.uid}/publico/dados`);
    docData(docRef).subscribe(data => {
    if (data) {
      const d = data as DadosPublicos;
      this.displayName = d.displayName || 'null';
      this.filmesFavoritos = d.filmesFavoritos || [];
      this.seriesFavoritas = d.seriesFavoritas || [];
      this.listaParaAssistir = d.listaParaAssistir || [];
      console.log('Dados públicos carregados:', this.displayName);
    } else {
      console.log('Documento não encontrado.');
    }
  });
  }
}
