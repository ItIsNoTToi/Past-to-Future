<!-- <script setup>
const query = inject("query"),
  isEnglish = inject("isEnglish");
let dbAggs = localStorage.getItem("db");
const mainCrud = "master_logs";
const collection = mainCrud;
const sort = ref([{ "loginfo.createAtString.keyword": "desc" }]),
  includes = ref(formConfig.get(formCRUD)[mainCrud].includes),
  renderPageAnime = ref("done___loading");
const condition = ref([]);
const crud = ref(formConfig.get(formCRUD)[mainCrud].crud);
const menuTabs = ref(formConfig.get(formCRUD)[mainCrud].menuTabs);
const title = ref(formConfig.get(formCRUD)[mainCrud]["table_title"]);
const table = ref({
  table: formConfig.get(formCRUD)[mainCrud].table,
  search: formConfig.get(formCRUD)[mainCrud].search,
  re_calculator: formConfig.get(formCRUD)[mainCrud].re_calculator,
  filter: formConfig.get(formCRUD)[mainCrud].filter,
  aggs: formConfig.get(formCRUD)[mainCrud].aggs,
});
const loading = ref(false);
formConfig.delete(formCRUD);
const backToList = () => {
  vuejx.redirect([
    {
      key: "menu",
      value: "",
    },
    {
      key: "_id",
      value: "",
    },
  ]);
};
if (query.page == "nhat_ky_truy_cap_phan_mem") {
  condition.value = [
    {
      bool: {
        should: [
          {
            match_phrase_prefix: {
              "loginfo.collection.raw": {
                query: "T_",
              },
            },
          },
          {
            match_phrase_prefix: {
              "loginfo.collection.raw": {
                query: "C_",
              },
            },
          },
        ],
      },
    },
    {
      bool: {
        must_not: [
          {
            match: {
              "loginfo.collection.keyword": "T_CanBo",
            },
          },
          {
            match: {
              "loginfo.collection.keyword": "C_QuyTrinhXuLy",
            },
          },
        ],
      },
    },
  ];
  //condition.value = []
} else if (query.page == "nhat_ky_dang_nhap") {
  condition.value = [
    {
      bool: {
        should: [
          {
            match: {
              "loginfo.log_type.keyword": "Login",
            },
          },
          {
            match: {
              "loginfo.log_type.keyword": "Logout",
            },
          },
        ],
      },
    },
  ];
} else if (query.page == "nhat_ky_loi_phat_sinh") {
  condition.value = [
    {
      match: {
        "loginfo.log_type.keyword": "ERROR",
      },
    },
    {
      bool: {
        must_not: [
          {
            match: {
              "loginfo.collection.keyword": "C_QuyTrinhXuLy",
            },
          },
          {
            match: {
              "loginfo.collection.keyword": "M_TaiNguyenHeThong",
            },
          },
        ],
      },
    },
  ];
} else if (query.page == "nhat_ky_quan_ly_tai_khoan") {
  let type = ["DELETE_DATA", "UPDATE_DATA", "CREATE_DATA"];
  condition.value = [
    {
      match: {
        "loginfo.collection.keyword": "T_CanBo",
      },
    },
    {
      bool: {
        should: [
          {
            terms: {
              "loginfo.log_type.keyword": type,
            },
          },
        ],
      },
    },
  ];
} else if (query.page == "nhat_ky_thay_doi_cau_hinh") {
  condition.value = [
    {
      match: {
        "loginfo.collection.keyword": "vuejx_config",
      },
    },
    {
      match: {
        "loginfo.log_type.keyword": "UPDATE_DATA",
      },
    },
    {
      bool: {
        must_not: [
          {
            match: {
              "loginfo.collection.keyword": "C_QuyTrinhXuLy",
            },
          },
          {
            match: {
              "loginfo.collection.keyword": "M_TaiNguyenHeThong",
            },
          },
        ],
      },
    },
  ];
} else {
  condition.value = [];
}
condition.value.push({
  bool: {
    should: [
      {
        terms: {
          "loginfo.db.keyword": ["CSDL_DUONGTHUY_NGUOIDIEUKHIEN"],
        },
      },
    ],
  },
});
const jsonData = ref({});
const toDetail = (data) => {
  console.warn("toDetail", data);
  jsonData.value = data;
  popupJson.value = true;
};
const popupJson = ref(false);
const fun_click_popup = () => {
  popupJson.value = false;
  jsonData.value = {};
};
</script>

<template>
  <div class="grid-custom">
    <div class="grid_layout blank_style" id="b2">
      <vuejx-table
        v-if="!query._id"
        class="dynamic__form__vuejx"
        :class="renderPageAnime"
        :title="title"
        :crud="false"
        :collection="collection"
        :sort="sort"
        :includes="includes"
        :condition="condition"
        :table_config="table"
        :autoDetail="false"
        @toDetail="toDetail"
      >
      </vuejx-table>
      <div
        v-if="popupJson"
        class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-1000"
      >
        <div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
        <div class="modal-container bg-white mx-auto rounded shadow-lg z-50">
          <div class="modal-content">
            <div
              class="flex justify-between items-center header___popup"
              style="padding: 6px 16px"
            >
              <p class="text-2xl font-bold">Chi tiết log</p>
              <div class="modal-close cursor-pointer z-50" @click="fun_click_popup">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#003987"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-x text-red-700"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </div>
            </div>
            <div class="p-3" :style="{ width: '900px' }">
              <div class="mt-2">
                <pre>{{ jsonData.data }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> -->

<script setup> 
    const pageView = inject('pageView');
    const query = inject("query");
    // console.debug(pageView);
    let framepage = ref('log/access/accesslog/');
    // console.debug(`/report/${framepage}`);
if (query.page == "nhat_ky_truy_cap_phan_mem") {
    // console.debug(1);
    framepage.value = 'log/access/accesslog/';
} else if (query.page == "nhat_ky_dang_nhap") {
    // console.debug(2);
    framepage.value = 'user/login/login/';
} else if (query.page == "nhat_ky_loi_phat_sinh") {
    // console.debug(3);
    framepage.value = 'dung_chung/all/csdl/';
} else if (query.page == "nhat_ky_quan_ly_tai_khoan") {
    // console.debug(4);
    framepage.value = 'user/account/accountlog/';
} else if (query.page == "nhat_ky_thay_doi_cau_hinh") {
    // console.debug(5);
    framepage.value = 'log/config/configlog/';
} else {
    // console.debug(6);
    framepage.value = 'log/access/accesslog/';
}
</script>

<template>
    <iframe v-if="query.page" :src="`/report/${framepage}`" scrolling="no" allowfullscreen  ></iframe>
</template>