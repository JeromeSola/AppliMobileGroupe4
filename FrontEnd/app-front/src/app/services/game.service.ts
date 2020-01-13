import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Achievement {
  id: number,
  name: string,
  description: string,
  xp: number
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public levelTable: number[] = [];
  public achievements: Achievement[] = [];

  constructor(private afs: AngularFirestore) {
    this.afs.collection<any>('Levels')
    .valueChanges().subscribe((documents: any) => { this.levelTable = documents[0].levels; });

    this.afs.collection<Achievement>('Achievements')
    .valueChanges().subscribe((achievements: Achievement[]) => {
      this.achievements = achievements;
      this.sortAchievements();
    });
  }

  public getUserPercentage(userXp: number, userLevel: number): number {
    if (userLevel === this.levelTable.length-1) { return 100; }
    const nextXp: number = this.levelTable[userLevel+1] - this.levelTable[userLevel];
    const currentXp: number = userXp - this.levelTable[userLevel];
    return Math.round(100 * (currentXp / nextXp));
  }

  private compareAchievements(a1: Achievement, a2: Achievement): number {
    if (a1.id < a2.id) { return -1; }
    if (a1.id > a2.id) { return 1; }
    return 0;
  }

  private sortAchievements(): void { this.achievements.sort( this.compareAchievements ); }

}
