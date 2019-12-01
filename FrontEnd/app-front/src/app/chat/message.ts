export class Message {
    
    constructor(
        private _htmlContent: string,
        private _isFromUser: boolean,
        private _sendDate: Date
    ) { }

    getDisplayedDate() {
        let hours: string = '';
        if (this.sendDate.getHours() < 10)
            hours = '0' + this.sendDate.getHours();
        else
            hours = '' + this.sendDate.getHours();

        let minutes: string = '';
        if (this.sendDate.getMinutes() < 10)
            minutes = '0' + this.sendDate.getMinutes();
        else
            minutes = '' + this.sendDate.getMinutes();

        return (hours + ':' + minutes);
    }

    get htmlContent() { return this._htmlContent; }
    set htmlContent(value: string) { this._htmlContent = value; }

    get isFromUser() { return this._isFromUser; }
    set isFromUser(value: boolean) { this._isFromUser = value; }

    get sendDate() { return this._sendDate; }
    set sendDate(value: Date) { this._sendDate = value; }

    public static getMockList() : Message[] {
        let mockList: Message[] = [];

        function addMinutes(dateObj, minutes) { return new Date(dateObj.getTime() + minutes*60000); }

        let date = new Date();

        let test = new Message('', false, addMinutes(date, -2));

        mockList.push(new Message('Bonjour.', true, addMinutes(date, -4)));
        mockList.push(new Message('Bonjour, que puis-je faire pour vous ?', false, addMinutes(date, -4)));
        mockList.push(new Message('Quel jour sommes-nous ?', true, addMinutes(date, -4)));
        mockList.push(new Message('Nous sommes le mardi 12 novembre, puis-je faire quelque chose d\'autre pour vous ?', false, addMinutes(date, -4)));
        mockList.push(new Message('Oui.', true, addMinutes(date, -3)));
        mockList.push(new Message('Que puis-je faire pour vous ?', false, addMinutes(date, -3)));
        mockList.push(new Message('Quelle heure est-t-il ?', true, addMinutes(date, -2)));
        mockList.push(new Message('Il est ' + test.getDisplayedDate() + '. Vous avez besoin de quelque chose d\'autre ?', false, addMinutes(date, -2)));
        mockList.push(new Message('Non ça ira merci.', true, addMinutes(date, -1)));
        mockList.push(new Message('À votre service.', false, date));

        return mockList;
    }

}