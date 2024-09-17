import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductlistScrollableComponent } from './produits/produits.component';
import { CartComponent } from './cart/cart.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { LivraisonComponent } from './livraison/livraison.component';
import { ProfileComponent } from './profile/profile.component'; // Importer le composant Profile
import { StatisticsComponent } from './statistics/statistics.component';
import { BeautyComponent } from './pages/beauty/beauty.component';
import { TelephonesTablettesComponent } from './pages/telephones-tablettes/telephones-tablettes.component';
import { ElectromenagersComponent } from './pages/electromenagers/electromenagers.component';
import { CuisineComponent } from './pages/cuisine/cuisine.component';

const routes: Routes = [
  { path: '', redirectTo: '/produits', pathMatch: 'full' },
  { path: 'produits', component: ProductlistScrollableComponent },
  { path: 'livraison', component: LivraisonComponent },
  { path: 'cart', component: CartComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent }, 
  { path: 'statistics', component: StatisticsComponent },
  { path: 'telephones-tablettes', component: TelephonesTablettesComponent },
  { path: 'electromenagers', component: ElectromenagersComponent },
  { path: 'beauty', component: BeautyComponent },
  { path: 'cuisine', component: CuisineComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
