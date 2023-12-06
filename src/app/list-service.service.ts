import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Subject, catchError, tap, throwError } from 'rxjs';
import {map} from 'rxjs';
import { List } from "./list.model";
import { Character } from "./character.model"
import { User } from "./user.model"
import { response } from 'express';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListServiceService {

  constructor(private http: HttpClient) { }

  /* private listCollection: List[] =[]
  private listUpdate = new Subject<List[]>()

  AddList(characterName1: string, characterSource1: string,
    characterName2: string, characterSource2: string,
    characterName3: string, characterSource3: string,
    characterName4: string, characterSource4: string,
    characterName5: string, characterSource5: string,
    characterName6: string, characterSource6: string,
    characterName7: string, characterSource7: string,
    characterName8: string, characterSource8: string,
    characterName9: string, characterSource9: string,
    characterName10: string, characterSource10: string
    ){
      console.log("Character Source in service: " + characterSource1)
      const list: List = { characterName1: characterName1, characterSource1: characterSource1,
        characterName2: characterName2, characterSource2: characterSource2,
        characterName3: characterName3, characterSource3: characterSource3,
        characterName4: characterName4, characterSource4: characterSource4,
        characterName5: characterName5, characterSource5: characterSource5,
        characterName6: characterName6, characterSource6: characterSource6,
        characterName7: characterName7, characterSource7: characterSource7,
        characterName8: characterName8, characterSource8: characterSource8,
        characterName9: characterName9, characterSource9: characterSource9,
        characterName10: characterName10, characterSource10: characterSource10
      }

      this.http.post<{characterName1: string, characterSource1: string}>('http://localhost:3000/api/list', list).
      subscribe((listData)=>{
        this.listCollection.push(list)
        this.listUpdate.next([...this.listCollection])
      });
    }

    getList(){
      this.http.get<{message: String, lists: List[]}>('http://localhost:3000/api/list').
      subscribe((listData)=>{
        this.listCollection = listData.lists;
        this.listUpdate.next([...this.listCollection])
      });
    } */


    private characterCollection: Character[] = []
    private characterUpdate = new Subject<Character[]>()

    AddCharacter(name:string, source:string, genre:string, powers: string, rank: number){
      const character: Character =  {
        _id: null,
        name: name,
        source: source,
        genre: genre,
        powers: powers,
        rank: rank
      }

      this.http.post<{name: string, source:string}>('http://localhost:3000/api/character', character, {withCredentials: true}).
      subscribe((characterData)=>{
        this.characterCollection.push(character)
        this.characterUpdate.next([...this.characterCollection])
      });
    }

    GetUserList(){
      this.http.get<{message: String, list: Character[]}>('http://localhost:3000/api/character', {withCredentials: true}).
      subscribe((characterData)=> {
        this.characterCollection = characterData.list;
        this.characterUpdate.next([...this.characterCollection])
        console.log(this.characterCollection)
      });
    }

    getCharacterUpdateListener(){
      return this.characterUpdate.asObservable();
    }

    private votingCharacters: Character[] = []
    private votingUpdate = new Subject<Character[]>()
    GetVotingCharacters(){
      this.http.get<{message: String, ballot: Character[]}>('http://localhost:3000/api/voting', {withCredentials: true}).
      subscribe((votingData)=> {
        this.votingCharacters = votingData.ballot
        this.votingUpdate.next([...this.votingCharacters])
        console.log(this.votingCharacters)
      })
    }

    getBallotUpdateListener(){
      return this.votingUpdate.asObservable()
    }

    private allCharacters: Character[] =[]
    private allCharactersUpdate = new Subject<Character[]>()
    GetAllCharactersByUser(){
      this.http.get<{message: String, characterList: Character[]}>('http://localhost:3000/api/posts', {withCredentials: true}).
      subscribe((data) => {
        //console.log("Characters in service: ", data.characterList)
        this.allCharacters = data.characterList
        //console.log("Characters in [allCharacters]", this.allCharacters)
        this.allCharactersUpdate.next([...this.allCharacters])
      })
    }

    getAllCharacterListener(){
      return this.allCharactersUpdate.asObservable()
    }

    Vote(votedCharacter: Character){
      console.log("Voting in the service")
      this.http.post<{message: String}>('http://localhost:3000/api/vote', votedCharacter, {withCredentials: true}).
      subscribe(
        (response) => {
          console.log("Voting successful")
        }
      )
    }

    //WORK IN PROGRESS
    private voteCount: number
    private voteCountUpdate = new Subject<number>()
    GetVoteCount(votedCharacter: Character){

      console.log("trying to count votes")
      console.log("Voted Character ID: ", votedCharacter._id)

      const params = new HttpParams().set('characterID', votedCharacter._id)

      this.http.get<{voteCount: number}>('http://localhost:3000/api/votes', {params, withCredentials: true}).
      subscribe((response) => {
          this.voteCount = response.voteCount
          this.voteCountUpdate.next(this.voteCount)
          console.log("Vote Update: ", this.voteCountUpdate)
      })
    }

    getCountUpdateListener(){
      return this.voteCountUpdate.asObservable()
    }

   

    // TryLogin(email:string, password: string): Observable<any> {
    //     const user: User = {
    //       email: email,
    //       username: "username",
    //       password: password
    //     }

    //     this.http.post<{email: string}>('http://localhost:3000/api/login', user, {withCredentials: true}).
    //     subscribe((userData)=>{
    //       this.loginCollection.push(user)
    //       this.loginUpdate.next([...this.loginCollection])
    //       console.log(userData)
    //     });

    //     // this.http.get('http://localhost:3000/api/login', {withCredentials: true}).
    //     // subscribe(response => {
    //     //   console.log(response)
    //     // })
    // }
    private loginCollection: User[] = []
    private loginUpdate = new Subject<User[]>
    
    // TryLogin(email: string, password: string): Observable<any> {
    //   const user: User = {
    //     email: email,
    //     username: "username", // Assuming you need this for something else
    //     password: password
    //   };
    
    //   // Return the observable here instead of subscribing
    //   return this.http.post<{email: string}>('http://localhost:3000/api/login', user, {withCredentials: true});
    // }
    TryLogin(email: string, password: string): Observable<any> {
      const user: User = {
        email: email,
        username: "username", // Assuming this is required for some reason
        password: password
      };
  
      // Make the HTTP request and handle the response
      return this.http.post<{ email: string }>('http://localhost:3000/api/login', user, { withCredentials: true })
        .pipe(
          tap(response => {
            console.log('Login Success Response:', response);
          }),
          catchError((error: HttpErrorResponse) => {
            console.error('Login Error Response:', error);
            
            // Handle the error appropriately
            //  rethrow the error or return a new Observable
            return throwError(() => new Error(error.message));
          })
        );
    }
  

    TrySignUp(email: string, username: string, password: string){
      const user: User = {
        email: email,
        username: username,
        password: password
      }

      this.http.post<{email: string, username: string}>('http://localhost:3000/api/signup', user).
      subscribe((userData)=>{
        this.loginCollection.push(user)
        this.loginUpdate.next([...this.loginCollection])
      });

      
    }

    addLoggedInUser(user: User) {
      this.loginCollection.push(user);
      this.loginUpdate.next([...this.loginCollection]);
    }
  
    // Method to get an Observable of login updates
    getLoginUpdateObservable(): Observable<User[]> {
      return this.loginUpdate.asObservable();
    }

    forgotPassword(email: string): Observable<any>{
      return this.http.post('http://localhost:3000/api/forgotPassword', { email });
    }

      // post request to reset the user's Password
    resetPassword(token: string, password: string, confirmPassword: string): Observable<any> {
      return this.http.post(`http://localhost:3000/api/resetPassword/${token}`, { password, confirmPassword });
    }
    
  }



