/// <reference path="csgo.d.ts" />
/// <reference path="common/characteranims.ts" />
/// <reference path="common/iteminfo.ts" />
/// <reference path="common/tint_spray_icon.ts" />
var InspectModelImage = (function () {
    let m_elPanel = null;
    let m_elContainer = null;
    let m_useAcknowledge = false;
    let m_rarityColor = '';
    const _Init = function (elContainer, itemId, funcGetSettingCallback) {
        const strViewFunc = funcGetSettingCallback ? funcGetSettingCallback('viewfunc', '') : '';
        if (ItemInfo.ItemDefinitionNameSubstrMatch(itemId, 'tournament_journal_'))
            itemId = (strViewFunc === 'primary') ? itemId : ItemInfo.GetFauxReplacementItemID(itemId, 'graffiti');
        if (!InventoryAPI.IsValidItemID(itemId)) {
            return '';
        }
        m_elContainer = elContainer;
        m_useAcknowledge = m_elContainer.Data().useAcknowledge ? m_elContainer.Data().useAcknowledge : false;
        m_rarityColor = ItemInfo.GetRarityColor(itemId);
        const model = ItemInfo.GetModelPathFromJSONOrAPI(itemId);
        if (ItemInfo.IsCharacter(itemId)) {
            m_elPanel = _InitCharScene('character', itemId);
        }
        else if (ItemInfo.GetSlot(itemId) == "melee") {
            m_elPanel = _InitMeleeScene('melee', itemId);
        }
        else if (ItemInfo.IsWeapon(itemId)) {
            m_elPanel = _InitWeaponScene('weapon', itemId);
        }
        else if (ItemInfo.IsDisplayItem(itemId)) {
            m_elPanel = _InitDisplayScene('flair', itemId);
        }
        else if (ItemInfo.GetSlot(itemId) == "musickit") {
            m_elPanel = _InitMusicKitScene('musickit', itemId);
        }
        else if (ItemInfo.IsCase(itemId)) {
            m_elPanel = _InitCaseScene('case', itemId);
        }
        else if (ItemInfo.IsSprayPaint(itemId) || ItemInfo.IsSpraySealed(itemId)) {
            m_elPanel = _InitSprayScene('spray', itemId);
        }
        else if (ItemInfo.ItemMatchDefName(itemId, 'name tag')) {
        }
        else if (ItemInfo.IsSticker(itemId) || ItemInfo.IsPatch(itemId)) {
            m_elPanel = _InitStickerScene('sticker', itemId);
        }
        else if (model) {
            if (ItemInfo.GetSlot(itemId) === 'clothing') {
                m_elPanel = _InitGlovesScene('gloves', itemId);
            }
            else {
            }
        }
        else if (!model) {
            m_elPanel = _SetImage(itemId);
        }
        return model;
    };
    const _InitCase = function (elContainer, itemId) {
        if (!InventoryAPI.IsValidItemID(itemId)) {
            return;
        }
        m_elContainer = elContainer;
        const model = ItemInfo.GetModelPathFromJSONOrAPI(itemId);
        if (model) {
            m_elPanel = _InitCaseScene('case', itemId);
        }
        else if (!model) {
            m_elPanel = _SetImage(itemId);
        }
    };
    const _InitSealedSpray = function (elContainer, itemId) {
        if (!InventoryAPI.IsValidItemID(itemId)) {
            return;
        }
        m_elContainer = elContainer;
        m_elPanel = _InitSprayScene('spray', itemId);
    };
    function _InitCharScene(name, itemId, bHide = false, bPlayCameraAnim = true) {
        let elPanel = m_elContainer.FindChildTraverse('CharPreviewPanel');
        let active_item_idx = 5;
        if (!elPanel) {
            let mapName = _GetBackGroundMap();
            elPanel = $.CreatePanel('MapPlayerPreviewPanel', m_elContainer, 'CharPreviewPanel', {
                "require-composition-layer": "true",
                "pin-fov": "vertical",
                class: 'full-width full-height hidden',
                camera: 'cam_char_inspect_wide_intro',
                player: "true",
                map: mapName,
                initial_entity: 'item',
                mouse_rotate: false,
                playername: "vanity_character",
                animgraphcharactermode: "inventory-inspect",
                animgraphturns: "true"
            });
        }
        const settings = ItemInfo.GetOrUpdateVanityCharacterSettings(itemId);
        elPanel.SetActiveCharacter(active_item_idx);
        settings.panel = elPanel;
        CharacterAnims.PlayAnimsOnPanel(settings);
        if (bPlayCameraAnim) {
            _AnimateIntroCamera(elPanel, 'char_inspect_wide', .5);
        }
        if (!bHide) {
            elPanel.RemoveClass('hidden');
        }
        _HidePanelItemEntities(elPanel);
        _HidePanelCharEntities(elPanel, true);
        _SetParticlesBg(elPanel);
        return elPanel;
    }
    function _InitWeaponScene(name, itemId) {
        let oSettings = {
            panel_type: "MapItemPreviewPanel",
            active_item_idx: 0,
            camera: 'cam_default',
            initial_entity: 'item',
            mouse_rotate: "true",
            rotation_limit_x: "360",
            rotation_limit_y: "90",
            auto_rotate_x: "35",
            auto_rotate_y: "10",
            auto_rotate_period_x: "15",
            auto_rotate_period_y: "25",
            player: "false",
        };
        const panel = _LoadInspectMap(itemId, oSettings);
        _HidePanelCharEntities(panel);
        _HideItemEntities(oSettings.active_item_idx, panel);
        _SetParticlesBg(panel);
        _SetItemCameraByWeaponType(itemId, panel);
        if (!m_useAcknowledge) {
            _InitCharScene(name, itemId, true);
        }
        return panel;
    }
    function _InitMeleeScene(name, itemId) {
        let oSettings = {
            panel_type: "MapItemPreviewPanel",
            active_item_idx: 8,
            camera: 'cam_melee_intro',
            initial_entity: 'item',
            mouse_rotate: "true",
            rotation_limit_x: "360",
            rotation_limit_y: "90",
            auto_rotate_x: "35",
            auto_rotate_y: "10",
            auto_rotate_period_x: "15",
            auto_rotate_period_y: "25",
            player: "false",
        };
        const panel = _LoadInspectMap(itemId, oSettings);
        _HidePanelCharEntities(panel);
        _HideItemEntities(oSettings.active_item_idx, panel);
        _SetParticlesBg(panel);
        _AnimateIntroCamera(panel, 'melee', .2);
        if (!m_useAcknowledge) {
            _InitCharScene(name, itemId, true);
        }
        return panel;
    }
    function _InitStickerScene(name, itemId) {
        let oSettings = {
            panel_type: "MapItemPreviewPanel",
            active_item_idx: 1,
            camera: 'cam_sticker_close_intro',
            initial_entity: 'item',
            mouse_rotate: "true",
            rotation_limit_x: "70",
            rotation_limit_y: "60",
            auto_rotate_x: "20",
            auto_rotate_y: "0",
            auto_rotate_period_x: "10",
            auto_rotate_period_y: "10",
            player: "false",
        };
        const panel = _LoadInspectMap(itemId, oSettings);
        _HidePanelCharEntities(panel);
        _HideItemEntities(oSettings.active_item_idx, panel);
        _SetParticlesBg(panel);
        _AnimateIntroCamera(panel, 'sticker_close', .2);
        return panel;
    }
    function _InitSprayScene(name, itemId) {
        let oSettings = {
            panel_type: "MapItemPreviewPanel",
            active_item_idx: 2,
            camera: 'camera_path_spray',
            initial_entity: 'item',
            mouse_rotate: "false",
            rotation_limit_x: "",
            rotation_limit_y: "",
            auto_rotate_x: "",
            auto_rotate_y: "",
            auto_rotate_period_x: "",
            auto_rotate_period_y: "",
            player: "false",
        };
        const panel = _LoadInspectMap(itemId, oSettings);
        _HidePanelCharEntities(panel);
        _HideItemEntities(oSettings.active_item_idx, panel);
        panel.TransitionToCamera('camera_path_spray', 0);
        return panel;
    }
    function _InitDisplayScene(name, itemId) {
        let oSettings = {
            panel_type: "MapItemPreviewPanel",
            active_item_idx: 3,
            camera: 'cam_display_close_intro',
            initial_entity: 'item',
            mouse_rotate: "true",
            rotation_limit_x: "70",
            rotation_limit_y: "60",
            auto_rotate_x: "45",
            auto_rotate_y: "12",
            auto_rotate_period_x: "20",
            auto_rotate_period_y: "20",
            player: "false",
        };
        const panel = _LoadInspectMap(itemId, oSettings);
        _HidePanelCharEntities(panel);
        _HideItemEntities(oSettings.active_item_idx, panel);
        _SetParticlesBg(panel);
        _AnimateIntroCamera(panel, 'display_close', .2);
        return panel;
    }
    function _InitMusicKitScene(name, itemId) {
        let oSettings = {
            panel_type: "MapItemPreviewPanel",
            active_item_idx: 4,
            camera: 'cam_musickit_intro',
            initial_entity: 'item',
            mouse_rotate: "true",
            rotation_limit_x: "55",
            rotation_limit_y: "55",
            auto_rotate_x: "10",
            auto_rotate_y: "0",
            auto_rotate_period_x: "20",
            auto_rotate_period_y: "20",
            player: "false",
        };
        const panel = _LoadInspectMap(itemId, oSettings);
        _HidePanelCharEntities(panel);
        _HideItemEntities(oSettings.active_item_idx, panel);
        _SetParticlesBg(panel);
        _AnimateIntroCamera(panel, 'musickit_close', .2);
        return panel;
    }
    function _InitCaseScene(name, itemId) {
        let oSettings = {
            panel_type: "MapItemPreviewPanel",
            active_item_idx: 6,
            camera: 'cam_case_intro',
            initial_entity: 'item',
            mouse_rotate: "false",
            rotation_limit_x: "",
            rotation_limit_y: "",
            auto_rotate_x: "",
            auto_rotate_y: "",
            auto_rotate_period_x: "",
            auto_rotate_period_y: "",
            player: "false",
        };
        const panel = _LoadInspectMap(itemId, oSettings);
        _HidePanelCharEntities(panel);
        _HideItemEntities(oSettings.active_item_idx, panel);
        _SetParticlesBg(panel);
        _AnimateIntroCamera(panel, 'case', .2);
        return panel;
    }
    function _InitGlovesScene(name, itemId) {
        let oSettings = {
            panel_type: "MapItemPreviewPanel",
            active_item_idx: 7,
            camera: 'cam_gloves',
            initial_entity: 'item',
            mouse_rotate: "false",
            rotation_limit_x: "",
            rotation_limit_y: "",
            auto_rotate_x: "",
            auto_rotate_y: "",
            auto_rotate_period_x: "",
            auto_rotate_period_y: "",
            player: "false",
        };
        const panel = _LoadInspectMap(itemId, oSettings);
        _HidePanelCharEntities(panel);
        _HideItemEntities(oSettings.active_item_idx, panel);
        _SetParticlesBg(panel);
        return panel;
    }
    function _GetBackGroundMap() {
        if (m_useAcknowledge) {
            return 'ui/acknowledge_item';
        }
        let backgroundMap = GameInterfaceAPI.GetSettingString('ui_mainmenu_bkgnd_movie');
        backgroundMap = !backgroundMap ? backgroundMap : 'de_' + backgroundMap + '_vanity';
        return backgroundMap;
    }
    function _LoadInspectMap(itemId, oSettings) {
        let elPanel = m_elContainer.FindChildTraverse('ItemPreviewPanel') || null;
        if (elPanel) {
            elPanel.RemoveAndDeleteChildren();
        }
        if (!elPanel) {
            let mapName = _GetBackGroundMap();
            elPanel = $.CreatePanel(oSettings.panel_type, m_elContainer, 'ItemPreviewPanel', {
                "require-composition-layer": "true",
                'erase-background': 'true',
                'disable-depth-of-field': m_useAcknowledge ? 'true' : 'false',
                "pin-fov": "vertical",
                class: 'full-width full-height hidden',
                camera: oSettings.camera,
                player: "true",
                map: mapName,
                initial_entity: 'item',
                mouse_rotate: oSettings.mouse_rotate,
                rotation_limit_x: oSettings.rotation_limit_x,
                rotation_limit_y: oSettings.rotation_limit_y,
                auto_rotate_x: oSettings.auto_rotate_x,
                auto_rotate_y: oSettings.auto_rotate_y,
                auto_rotate_period_x: oSettings.auto_rotate_period_x,
                auto_rotate_period_y: oSettings.auto_rotate_period_y
            });
        }
        let modelPath = ItemInfo.GetModelPathFromJSONOrAPI(itemId);
        elPanel.SetActiveItem(oSettings.active_item_idx);
        elPanel.SetItemItemId(itemId);
        elPanel.RemoveClass('hidden');
        return elPanel;
    }
    function _SetItemCameraByWeaponType(itemId, elItemPanel) {
        const slot = InventoryAPI.GetSlot(itemId);
        const defName = InventoryAPI.GetItemDefinitionName(itemId);
        var strCamera = 'wide';
        switch (slot) {
            case 'secondary':
                strCamera = 'close';
                break;
            case 'smg':
                strCamera = 'mid_close';
                break;
        }
        switch (defName) {
            case 'weapon_awp':
                strCamera = 'far';
                break;
            case 'weapon_usp_silencer':
                strCamera = 'mid_close';
                break;
            case 'weapon_ssg08':
                strCamera = 'far';
                break;
            case 'weapon_galilar':
                strCamera = 'mid';
                break;
            case 'weapon_aug':
                strCamera = 'mid';
                break;
            case 'weapon_mp5sd':
                strCamera = 'mid';
                break;
            case 'weapon_m249':
                strCamera = 'far';
                break;
            case 'weapon_elite':
                strCamera = 'mid_close';
                break;
            case 'weapon_tec9':
                strCamera = 'mid_close';
                break;
            case 'weapon_ump45':
                strCamera = "mid";
                break;
            case 'weapon_bizon':
                strCamera = "mid";
                break;
            case 'weapon_mag7':
                strCamera = "mid";
                break;
            case 'weapon_c4':
                strCamera = "mid_close";
                break;
            case 'weapon_knife':
                strCamera = "mid_close";
                break;
        }
        _AnimateIntroCamera(elItemPanel, strCamera, .3);
    }
    ;
    function _AnimateIntroCamera(elPanel, strCamera, nDelay) {
        elPanel.TransitionToCamera('cam_' + strCamera + '_intro', 0);
        $.Schedule(nDelay, function () {
            if (elPanel.IsValid() && elPanel) {
                elPanel.TransitionToCamera('cam_' + strCamera, 1.5);
            }
        });
    }
    const _SetImage = function (itemId) {
        let elPanel = m_elContainer.FindChildTraverse('InspectItemImage');
        if (!elPanel) {
            elPanel = $.CreatePanel('Panel', m_elContainer, 'InspectItemImage');
            elPanel.BLoadLayoutSnippet("snippet-image");
        }
        const elImagePanel = elPanel.FindChildTraverse('ImagePreviewPanel');
        elImagePanel.itemid = Number(itemId);
        elImagePanel.RemoveClass('hidden');
        _TintSprayImage(itemId, elImagePanel);
        return elImagePanel;
    };
    const _TintSprayImage = function (id, elImage) {
        TintSprayIcon.CheckIsSprayAndTint(id, elImage);
    };
    const _SetCharScene = function (elPanel, characterItemId, weaponItemId) {
        const settings = ItemInfo.GetOrUpdateVanityCharacterSettings(characterItemId);
        _InitCharScene("character", characterItemId, true, false);
    };
    const _CancelCharAnim = function (elContainer) {
    };
    const _ShowHideItemPanel = function (bshow) {
        if (!m_elContainer.IsValid())
            return;
        const elItemPanel = m_elContainer.FindChildTraverse('ItemPreviewPanel');
        elItemPanel.SetHasClass('hidden', !bshow);
        if (bshow)
            $.DispatchEvent("CSGOPlaySoundEffect", "weapon_showSolo", "MOUSE");
    };
    const _ShowHideCharPanel = function (bshow) {
        if (!m_elContainer.IsValid())
            return;
        const elCharPanel = m_elContainer.FindChildTraverse('CharPreviewPanel');
        elCharPanel.SetHasClass('hidden', !bshow);
        if (bshow)
            $.DispatchEvent("CSGOPlaySoundEffect", "weapon_showOnChar", "MOUSE");
    };
    const _GetModelPanel = function () {
        return m_elPanel;
    };
    const _GetImagePanel = function () {
        return m_elPanel;
    };
    const _HidePanelCharEntities = function (elPanel, bIsPlayerInspect = false) {
        elPanel.FireEntityInput('vanity_character', 'Alpha', '0');
        elPanel.FireEntityInput('vanity_character1', 'Alpha', '0');
        elPanel.FireEntityInput('vanity_character2', 'Alpha', '0');
        elPanel.FireEntityInput('vanity_character3', 'Alpha', '0');
        elPanel.FireEntityInput('vanity_character4', 'Alpha', '0');
        if (!bIsPlayerInspect) {
            elPanel.FireEntityInput('vanity_character5', 'Alpha', '0');
        }
    };
    const _HidePanelItemEntities = function (elPanel) {
        _HideItemEntities(-1, elPanel);
    };
    const _HideItemEntities = function (indexShow, elPanel) {
        let numItemEntitesInMap = 8;
        for (var i = 0; i <= numItemEntitesInMap; i++) {
            let itemIndexMod = i === 0 ? '' : i.toString();
            if (indexShow !== i) {
                elPanel.FireEntityInput('item' + itemIndexMod, 'Alpha', '0');
                elPanel.FireEntityInput('light_item' + itemIndexMod, 'Disable', '0');
                elPanel.FireEntityInput('light_item_new' + itemIndexMod, 'Disable', '0');
            }
            else {
                _SetRimLight(itemIndexMod, elPanel);
            }
        }
    };
    const _SetParticlesBg = function (elPanel) {
        if (!m_useAcknowledge) {
            return;
        }
        const oColor = _HexColorToRgb(m_rarityColor);
        elPanel.FireEntityInput('acknowledge_particle', 'SetControlPoint', '16: ' + oColor.r.toString() + ' ' + oColor.g.toString() + ' ' + oColor.b.toString());
    };
    const _SetRimLight = function (indexShow, elPanel) {
        if (m_useAcknowledge) {
            elPanel.FireEntityInput('light_item' + indexShow, 'Disable', '0');
            const oColor = _HexColorToRgb(m_rarityColor);
            let lightNameInMap = "light_item_new" + indexShow;
            elPanel.FireEntityInput(lightNameInMap, 'SetColor', oColor.r.toString() + ' ' + oColor.g.toString() + ' ' + oColor.b.toString());
        }
        else {
            elPanel.FireEntityInput('light_item_new' + indexShow, 'Disable', '0');
        }
    };
    const _HexColorToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    };
    return {
        Init: _Init,
        InitCase: _InitCase,
        InitSealedSpray: _InitSealedSpray,
        SetCharScene: _SetCharScene,
        CancelCharAnim: _CancelCharAnim,
        ShowHideItemPanel: _ShowHideItemPanel,
        ShowHideCharPanel: _ShowHideCharPanel,
        GetModelPanel: _GetModelPanel,
        GetImagePanel: _GetImagePanel,
        HidePanelItemEntities: _HidePanelItemEntities,
        HidePanelCharEntities: _HidePanelCharEntities
    };
})();
(function () {
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zcGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluc3BlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsa0NBQWtDO0FBQ2xDLGlEQUFpRDtBQUNqRCwyQ0FBMkM7QUFDM0Msa0RBQWtEO0FBRWxELElBQUksaUJBQWlCLEdBQUcsQ0FBRTtJQUV6QixJQUFJLFNBQVMsR0FBa0UsSUFBSyxDQUFDO0lBQ3JGLElBQUksYUFBYSxHQUFZLElBQUssQ0FBQztJQUNuQyxJQUFJLGdCQUFnQixHQUFZLEtBQUssQ0FBQztJQUN0QyxJQUFJLGFBQWEsR0FBVyxFQUFFLENBQUM7SUFpQi9CLE1BQU0sS0FBSyxHQUFHLFVBQVcsV0FBb0IsRUFBRSxNQUFjLEVBQUUsc0JBQTRFO1FBSTFJLE1BQU0sV0FBVyxHQUFHLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBRSxVQUFVLEVBQUUsRUFBRSxDQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUUzRixJQUFLLFFBQVEsQ0FBQyw2QkFBNkIsQ0FBRSxNQUFNLEVBQUUscUJBQXFCLENBQUU7WUFDM0UsTUFBTSxHQUFHLENBQUUsV0FBVyxLQUFLLFNBQVMsQ0FBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBRSxNQUFNLEVBQUUsVUFBVSxDQUFFLENBQUM7UUFFM0csSUFBSyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUUsTUFBTSxDQUFFLEVBQzFDO1lBQ0MsT0FBTyxFQUFFLENBQUM7U0FDVjtRQUVELGFBQWEsR0FBRyxXQUFXLENBQUM7UUFDNUIsZ0JBQWdCLEdBQUcsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ3JHLGFBQWEsR0FBSSxRQUFRLENBQUMsY0FBYyxDQUFFLE1BQU0sQ0FB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