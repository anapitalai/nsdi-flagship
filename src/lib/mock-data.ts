export type DashboardUser = {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
  portal: string;
};

export type DashboardItemType = {
  id: string;
  name: string;
  slug: string;
  color: string;
};

export type DashboardCollection = {
  id: string;
  name: string;
  description: string;
  itemTypeIds: string[];
};

export type DashboardItem = {
  id: string;
  name: string;
  itemTypeId: string;
  collectionIds: string[];
  format: string;
  size: string;
  epsg?: number;
  processingLevel?: "raw" | "derived" | "analysis_ready" | "product";
};

export const dashboardMockData: {
  user: DashboardUser;
  itemTypes: DashboardItemType[];
  collections: DashboardCollection[];
  items: DashboardItem[];
} = {
  user: {
    id: "anapitalai",
    name: "Alois Napitalai",
    email: "anapitalai@gmail.com",
    initials: "AN",
    role: "Admin",
    portal: "National Mapping Unit",
  },
  itemTypes: [
    { id: "type_vector", name: "Vector", slug: "vector-geospatial", color: "#2392ff" },
    { id: "type_raster", name: "Raster", slug: "raster-imagery", color: "#3fb950" },
    { id: "type_pointcloud", name: "Point Cloud", slug: "pointcloud-lidar", color: "#f59e0b" },
    { id: "type_gnss", name: "GNSS", slug: "gnss-rinex", color: "#a855f7" },
    { id: "type_ai_ml", name: "AI / ML", slug: "ml-training-vector", color: "#f43f5e" },
    { id: "type_reference", name: "Reference", slug: "crs-definition", color: "#22d3ee" },
  ],
  collections: [
    {
      id: "col_morobe_survey",
      name: "2024 Topographic Survey - Morobe Province",
      description: "LAS, RINEX, GeoTIFF",
      itemTypeIds: ["type_pointcloud", "type_gnss", "type_raster"],
    },
    {
      id: "col_sentinel_archive",
      name: "Sentinel-2 Archive PNG 2020-2024",
      description: "COG, STAC",
      itemTypeIds: ["type_raster"],
    },
    {
      id: "col_road_ml",
      name: "Road Network ML Training Set",
      description: "GeoParquet labels",
      itemTypeIds: ["type_ai_ml", "type_vector"],
    },
    {
      id: "col_height_control",
      name: "National Height Datum Control Points",
      description: "Control, RINEX",
      itemTypeIds: ["type_gnss", "type_reference"],
    },
  ],
  items: [
    {
      id: "item_copc_tile",
      name: "morobe_block12_tile_07.copc.laz",
      itemTypeId: "type_pointcloud",
      collectionIds: ["col_morobe_survey"],
      format: "COPC",
      size: "1.2 GB",
      epsg: 32755,
      processingLevel: "analysis_ready",
    },
    {
      id: "item_s2_scene",
      name: "s2_2024_03_18_scene_11.cog.tif",
      itemTypeId: "type_raster",
      collectionIds: ["col_sentinel_archive"],
      format: "COG",
      size: "10 m",
      epsg: 32755,
      processingLevel: "analysis_ready",
    },
    {
      id: "item_rinex_batch",
      name: "control_network_rnx_batch_02.zip",
      itemTypeId: "type_gnss",
      collectionIds: ["col_morobe_survey", "col_height_control"],
      format: "RINEX 3",
      size: "322 MB",
      processingLevel: "raw",
    },
    {
      id: "item_labels",
      name: "road_labels_v6.geoparquet",
      itemTypeId: "type_ai_ml",
      collectionIds: ["col_road_ml"],
      format: "GeoParquet",
      size: "2.4M features",
      processingLevel: "derived",
    },
    {
      id: "item_ntv2_grid",
      name: "national_crs_shift_png2020.gsb",
      itemTypeId: "type_reference",
      collectionIds: ["col_height_control"],
      format: "NTv2 grid",
      size: "18 MB",
      processingLevel: "product",
    },
  ],
};
