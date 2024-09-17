@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5102/api/users';

  constructor(private http: HttpClient) {}

  getTopClients(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/top-clients`);
  }

  getTopCity(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/top-city`);
  }

  getTopProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/top-products`);
  }
}
