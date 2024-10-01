import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { OlympicCountry } from '../../core/models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicCountry[] | null>(null);
  private fetchError$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  /**
   * Fetches the initial data from the server, and emits the result on the
   * `olympics$` subject. If the request fails, it emits an error message on
   * the `fetchError$` subject and completes the `olympics$` subject.
   * @returns an observable that emits the requested data or an error
   */
  loadInitialData() {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error: HttpErrorResponse) => {
        this.fetchError$.next('Error loading data : ' + error.message);
        this.olympics$.next(null);
        this.olympics$.complete();
        return throwError(() => error);
      })
    );
  }

  /**
   * @returns an observable that emits error messages
   */
  getFetchError(): Observable<string | null> {
    return this.fetchError$.asObservable();
  }

  /**
   * @returns an observable that emits the data from the dtb.
   */
  getOlympics() {
    return this.olympics$.asObservable();
  }

  /**
   * Return the Olympic country that matches the given country name
   * @param countryName the name of the country to retrieve
   * @returns the matching Olympic country, or undefined if none found
   */
  getOlympicByCountry(
    countryName: string
  ): Observable<OlympicCountry | undefined> {
    return this.olympics$.asObservable().pipe(
      map((countries: OlympicCountry[] | null) => {
        return countries?.find((country) => country.country == countryName);
      })
    );
  }
}
