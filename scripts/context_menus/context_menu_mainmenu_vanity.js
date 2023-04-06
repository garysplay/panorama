/// <reference path="../csgo.d.ts" />
/// <reference path="../common/iteminfo.ts" />
/// <reference path="../common/characteranims.ts" />
var MainMenuVanityContextMenu = (function () {
    function _Init() {
        let strType = $.GetContextPanel().GetAttributeString("type", "");
        let team = $.GetContextPanel().GetAttributeString("team", "");
        if (strType === 'catagory') {
            MakeCatBtns(team);
            return;
        }
        if (strType === 'weapons') {
            MakeWeaponBtns(team);
            return;
        }
        MakeMapBtns();
    }
    function fnAddVanityPopupMenuItem(idString, strItemNameString, fnOnActivate) {
        let elContextMenuBodyNoScroll = $.GetContextPanel().FindChildTraverse('ContextMenuBodyNoScroll');
        let elItem = $.CreatePanel('Button', elContextMenuBodyNoScroll, idString);
        elItem.BLoadLayoutSnippet('snippet-vanity-item');
        let elLabel = elItem.FindChildTraverse('id-vanity-item__label');
        elLabel.text = $.Localize(strItemNameString);
        elItem.SetPanelEvent('onactivate', fnOnActivate);
        return elItem;
    }
    ;
    function MakeCatBtns(team) {
        let elContextMenuBodyNoScroll = $.GetContextPanel().FindChildTraverse('ContextMenuBodyNoScroll');
        elContextMenuBodyNoScroll.RemoveAndDeleteChildren();
        let strOtherTeamToPrecache = ((team == '2') ? 'ct' : 't');
        fnAddVanityPopupMenuItem('switchTo_' + strOtherTeamToPrecache, '#mainmenu_switch_vanity_to_' + strOtherTeamToPrecache, function () {
            $.DispatchEvent("MainMenuSwitchVanity", strOtherTeamToPrecache);
            $.DispatchEvent('ContextMenuEvent', '');
        }).SetFocus();
        fnAddVanityPopupMenuItem('GoToLoadout', '#mainmenu_go_to_character_loadout', function () {
            $.DispatchEvent("MainMenuGoToCharacterLoadout", team);
            $.DispatchEvent('ContextMenuEvent', '');
        }).AddClass('BottomSeparator');
        fnAddVanityPopupMenuItem('ChangeVanityMap', '#mainmenu_change_vanity_map', function () {
            const elVanityContextMenu = UiToolkitAPI.ShowCustomLayoutContextMenuParametersDismissEvent('id-vanity-contextmenu-maps', '', 'file://{resources}/layout/context_menus/context_menu_mainmenu_vanity.xml', 'type=maps', function () { });
        });
        fnAddVanityPopupMenuItem('ChangeWeapon', '#mainmenu_change_vanity_weapon', function () {
            const elVanityContextMenu = UiToolkitAPI.ShowCustomLayoutContextMenuParametersDismissEvent('id-vanity-contextmenu-weapons', '', 'file://{resources}/layout/context_menus/context_menu_mainmenu_vanity.xml', 'type=weapons' +
                '&' + 'team=' + team, function () { });
        });
        let otherTeamCharacterItemID = LoadoutAPI.GetItemID(strOtherTeamToPrecache, 'customplayer');
        let settingsForOtherTeam = ItemInfo.GetOrUpdateVanityCharacterSettings(otherTeamCharacterItemID);
        ItemInfo.PrecacheVanityCharacterSettings(settingsForOtherTeam);
    }
    ;
    function MakeWeaponBtns(team) {
        let elContextMenuBodyWeapons = $.GetContextPanel().FindChildTraverse('ContextMenuBodyWeapons');
        elContextMenuBodyWeapons.RemoveAndDeleteChildren();
        let list = ItemInfo.GetLoadoutWeapons(team);
        if (list && list.length > 0) {
            list.forEach(function (entry) {
                let elItem = $.CreatePanel('Button', elContextMenuBodyWeapons, entry);
                elItem.BLoadLayoutSnippet('snippet-vanity-item');
                elItem.AddClass('vanity-item--weapon');
                let elLabel = elItem.FindChildTraverse('id-vanity-item__label');
                elLabel.text = ItemInfo.GetName(entry);
                let elRarity = elItem.FindChildTraverse('id-vanity-item__rarity');
                let rarityColor = ItemInfo.GetRarityColor(entry);
                elRarity.style.backgroundColor = "gradient( linear, 0% 0%, 100% 0%, from(" + rarityColor + " ),  color-stop( 0.0125, #00000000 ), to( #00000000 ) );";
                elItem.SetPanelEvent('onactivate', function () {
                    let shortTeam = CharacterAnims.NormalizeTeamName(team, true);
                    let loadoutSubSlot = ItemInfo.GetSlotSubPosition(entry);
                    GameInterfaceAPI.SetSettingString('ui_vanitysetting_loadoutslot_' + shortTeam, loadoutSubSlot);
                    $.DispatchEvent('ForceRestartVanity');
                    $.DispatchEvent('ContextMenuEvent', '');
                });
            });
        }
    }
    function MakeMapBtns() {
        let aMaps = [
            'dust2',
            'mirage',
            'nuke',
            'overpass'
        ];
        var elContextMenuBodyNoScroll = $.GetContextPanel().FindChildTraverse('ContextMenuBodyNoScroll');
        elContextMenuBodyNoScroll.RemoveAndDeleteChildren();
        if (!MyPersonaAPI.GetBetaType().includes('fullversion')) {
            aMaps = aMaps.filter(index => index === 'dust2');
        }
        aMaps.forEach(function (map) {
            fnAddVanityPopupMenuItem('context-menu-vanity-' + map, '#SFUI_Map_de_' + map, function () {
                GameInterfaceAPI.SetSettingString('ui_mainmenu_bkgnd_movie', map);
                $.DispatchEvent('ContextMenuEvent', '');
            });
        });
    }
    return {
        Init: _Init,
    };
})();
(function () {
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dF9tZW51X21haW5tZW51X3Zhbml0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRleHRfbWVudV9tYWlubWVudV92YW5pdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscUNBQXFDO0FBQ3JDLDhDQUE4QztBQUM5QyxvREFBb0Q7QUFFcEQsSUFBSSx5QkFBeUIsR0FBRyxDQUFFO0lBRWpDLFNBQVMsS0FBSztRQUViLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBRSxNQUFNLEVBQUUsRUFBRSxDQUFFLENBQUM7UUFDbkUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLGtCQUFrQixDQUFFLE1BQU0sRUFBRSxFQUFFLENBQUUsQ0FBQztRQUVoRSxJQUFLLE9BQU8sS0FBSyxVQUFVLEVBQzNCO1lBQ0MsV0FBVyxDQUFFLElBQUksQ0FBRSxDQUFDO1lBQ3BCLE9BQU87U0FDUDtRQUVELElBQUssT0FBTyxLQUFLLFNBQVMsRUFDMUI7WUFDQyxjQUFjLENBQUUsSUFBSSxDQUFFLENBQUM7WUFDdkIsT0FBTztTQUNQO1FBQ0QsV0FBVyxFQUFFLENBQUM7SUFDZixDQUFDO0lBR0QsU0FBUyx3QkFBd0IsQ0FBRyxRQUFlLEVBQUUsaUJBQXdCLEVBQUUsWUFBdUI7UUFFckcsSUFBSSx5QkFBeUIsR0FBRyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUMsaUJBQWlCLENBQUUseUJBQXlCLENBQUUsQ0FBQztRQUNuRyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFFLFFBQVEsRUFBRSx5QkFBeUIsRUFBRSxRQUFRLENBQUUsQ0FBQztRQUM1RSxNQUFNLENBQUMsa0JBQWtCLENBQUUscUJBQXFCLENBQUUsQ0FBQztRQUNuRCxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUUsdUJBQXVCLENBQWEsQ0FBQztRQUM3RSxPQUFPLENBQUMsSUFB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