import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { environment } from '../../environments/environment';
import { AccountDetails } from '../common/models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private getHttpOptions() {
    return {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };
}

  constructor(private http : HttpClient) { }

  public getAccount(accountId : string, page : number, size : number):Observable<AccountDetails>{
    return this.http.get<AccountDetails>(environment.backendHost+"/accounts/"+accountId+"/pageOperations?page="+page+"&size="+size);
  }
  public debit(accountId : string, amount : number, description:string){
    let data={accountId : accountId, amount : amount, description : description}
    return this.http.post(environment.backendHost+"/accounts/debit",data,this.getHttpOptions());
  }
  public credit(accountId : string, amount : number, description:string){
    let data={accountId : accountId, amount : amount, description : description}
    return this.http.post(environment.backendHost+"/accounts/credit",data,this.getHttpOptions());
  }
  public transfer(fromAccountId: string,toAccountId: string, amount : number, description:string){
    let data={fromAccountId, toAccountId, amount, description }
    return this.http.post(environment.backendHost+"/accounts/transfer",data,this.getHttpOptions());
  }

  createAccount(formData: any) {
    let data={formData }
    return this.http.post(environment.backendHost+"/accounts",data,this.getHttpOptions());
  }
}
