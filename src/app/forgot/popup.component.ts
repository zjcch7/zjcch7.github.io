import { ImplicitReceiver } from "@angular/compiler";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialog } from "@angular/material/dialog";

@Component({
    selector: 'app-forgot',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.css']
})

export class PopupComponent implements OnInit{

    emailName: string;
    constructor(@Inject(MAT_DIALOG_DATA) public data, private dialogRef : MatDialog){
        this.emailName = data.name
    }

    ngOnInit(): void {
        
    }

}