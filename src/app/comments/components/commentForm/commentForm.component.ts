import{Component,Input,EventEmitter,OnInit, Output} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { LoginService } from "src/app/login/login-component/login.service";





@Component({
    selector:'comment-form',
    templateUrl:'./commentForm.component.html',
    styleUrls:['./commentForm.component.css'],
    
})
export class CommentFormComponent implements OnInit{
    @Input() submitLabel!:string;
    @Input() initialText:string ='';

    @Output() handleSubmit = new EventEmitter<string>()

    form!: FormGroup;
    userLoggedIn: boolean = false;
    name: string = "No user";
    constructor(private fb: FormBuilder,private loginService:LoginService){}

    ngOnInit(): void {
        this.loginService.currentUserLoggedIn$.subscribe({
            next: (status) => this.userLoggedIn = status,
            error: (error) => console.error('Error in userLoggedIn subscription', error)
        });
        this.form = this.fb.group({
            title:[this.initialText, Validators.required],
        });
    }
    onSubmit(): void{
        console.log('onSubmit',this.form.value);
        this.handleSubmit.emit(this.form.value.title);
        this.form.reset()
        
}
}
